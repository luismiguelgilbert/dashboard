import serverDB from '@/server/utils/db';
import Excel from 'exceljs';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { filter_payload } from '@/types/server/filter_payload';
import { sanitizeSQL } from '@/utils/utils';
import { sort_options, filter_options } from '@/types/server/security/sys_roles';
import { type type_filter_selection } from '@/types/client/filter_payload';

export default defineEventHandler( async (event) => {
  try{
    const userSessionId = event.context.user.id;
    await hasUserPermission(userSessionId, PermissionsList.ROLES_EXPORT);

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
      ? ` and fts @@ to_tsquery('${search_string.replaceAll(' ','+') }:*')`
      : '';
    
    const text = `
      WITH users_by_profile AS (
        select
          sys_profile_id
          , count(*) as user_count
        from sys_users int1
        group by int1.sys_profile_id
      )
      SELECT
          a.id
        , INITCAP(a.name_es) as name_es
        , a.is_active
        , to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        , to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
        , COALESCE(b.user_count,0) as user_count
      FROM sys_profiles a
      LEFT JOIN users_by_profile b on a.id = b.sys_profile_id
      WHERE 1 = 1
        ${filterQueryString}
        ${filterSearchString}
        ORDER BY ${sortBy} ${sortByOrder ? 'ASC' : 'DESC'}
    `;
    const data = await serverDB.query(text);
    const workbook = new Excel.Workbook();
    const worksheet = await workbook.addWorksheet('Usuarios');
    const fileColumns = [
      { key: 'id', header: 'Código', width: 10  },
      { key: 'name_es', header: 'Perfil', width: 40 },
      { key: 'is_active', header: 'Activo', width: 10 },
      { key: 'user_count', header: '# Usuarios', width: 15 },
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