import serverDB from '@/server/utils/db';
import Excel from 'exceljs';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { filter_payload } from '@/types/server/filter_payload';
import { sanitizeSQL } from '@/utils/utils';
import { sort_options, filter_options } from '@/types/server/ens/ens_teams';
import { type type_filter_selection } from '@/types/client/filter_payload';

export default defineEventHandler( async (event) => {
  try{
    const userSessionId = event.context.user.id;
    await hasUserPermission(userSessionId, PermissionsList.ENSTEAMS_EXPORT);
    
    const filter = await readValidatedBody(event, body => filter_payload.cast(body));
    const sortBy = sort_options.find(x => x.key === filter.sortBy)?.query!;
    const sortByOrder = Boolean(filter.sortByOrder);
    const filterBy: type_filter_selection = filter.filterSelection;
    let filterQueryString = '';
    Object.keys(filterBy).forEach(key => {
      if (filterBy[key].length > 0) {
        filterQueryString += ` and ${filter_options.find(x => x.key == key)?.query} in (${JSON.stringify(filterBy[key]) })`;
      }
    });
    filterQueryString = filterQueryString.replaceAll('([', '(').replaceAll('])', ')').replaceAll('"', '\'');

    const search_string = sanitizeSQL(filter.searchString);
    const filterSearchString = search_string.length > 0
      ? ` and (a.name_es ILIKE '%${search_string}%' or a.nivel_0 ILIKE '%${search_string}%' or a.nivel_1 ILIKE '%${search_string}%' or a.nivel_2 ILIKE '%${search_string}%' or a.nivel_3 ILIKE '%${search_string}%' or a.nivel_4 ILIKE '%${search_string}%' or a.nivel_5 ILIKE '%${search_string}%' or a.nivel_6 ILIKE '%${search_string}%' )`
      : '';
    
    const text = `
      SELECT
          a.id
        , INITCAP(a.name_es) as name_es
        , a.is_active
        , INITCAP(a.nivel_0) as nivel_0
        , INITCAP(a.nivel_1) as nivel_1
        , INITCAP(a.nivel_2) as nivel_2
        , INITCAP(a.nivel_3) as nivel_3
        , INITCAP(a.nivel_4) as nivel_4
        , INITCAP(a.nivel_5) as nivel_5
        , INITCAP(a.nivel_6) as nivel_6
        , to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        , to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
        , count(*) OVER() AS row_count
      FROM ens_teams a
      WHERE 1 = 1 
        ${filterQueryString}
        ${filterSearchString}
        ORDER BY ${sortBy} ${sortByOrder ? 'ASC' : 'DESC'}
    `;
    const data = await serverDB.query(text);
    const workbook = new Excel.Workbook();
    const worksheet = await workbook.addWorksheet('Equipos');
    const fileColumns = [
      { key: 'id', header: 'Código', width: 10  },
      { key: 'name_es', header: 'Equipo', width: 40 },
      { key: 'is_active', header: 'Activo', width: 10 },
      { key: 'nivel_0', header: 'Ciudad', width: 15 },
      { key: 'nivel_1', header: 'Sector', width: 15 },
      { key: 'nivel_2', header: 'Provincia', width: 15 },
      { key: 'nivel_3', header: 'Región', width: 15 },
      { key: 'nivel_4', header: 'País', width: 15 },
      { key: 'nivel_5', header: 'Super Región', width: 25 },
      { key: 'nivel_6', header: 'Zona', width: 15 },
      { key: 'created_at', header: 'Fecha_Creación', width: 25 },
      { key: 'updated_at', header: 'Fecha_Actualización', width: 25 },
    ];
    worksheet.columns = fileColumns;
    worksheet.getRow(1).font = { size: 16, bold: true };
    worksheet.views = [{state: 'frozen', ySplit: 1}];
    worksheet.addRows(data.rows);
    setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    return await workbook.xlsx.writeBuffer();
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});