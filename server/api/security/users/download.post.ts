import serverDB from '@/server/utils/db';
import Excel from 'exceljs';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { filter_payload } from '@/types/server/filter_payload';
import { sanitizeSQL } from '@/utils/utils';
import { sort_options, filter_options } from '@/types/server/security/sys_users';
import { type type_filter_selection } from '@/types/client/filter_payload';

export default defineEventHandler( async (event) => {
  try{
    const userSessionId = event.context.user.id;
    await hasUserPermission(userSessionId, PermissionsList.USERS_EXPORT);

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
      select
      a.id,
      INITCAP(b.user_name) as user_name,
      INITCAP(b.user_lastname) as user_lastname,
      b.user_sex,
      b.avatar_url,
      b.website,
      a.email,
      INITCAP(coalesce(d.name_es, '...')) as sys_profile_name,
      to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at,
      to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at,
      to_char (a.last_sign_in_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as last_sign_in_at
      from auth.users a
      left join sys_users b on a.id = b.id
      left join sys_profiles d on b.sys_profile_id = d.id
      WHERE 1 = 1
        ${filterQueryString}
        ${filterSearchString}
        ORDER BY ${sortBy} ${sortByOrder ? 'ASC' : 'DESC'}
    `;
    const data = await serverDB.query(text);
    const workbook = new Excel.Workbook();
    const worksheet = await workbook.addWorksheet('Usuarios');
    const fileColumns = [
      { key: 'id', header: 'Código', width: 50  },
      { key: 'user_name', header: 'Nombres', width: 25 },
      { key: 'user_lastname', header: 'Apellidos', width: 25 },
      { key: 'user_sex', header: 'Sexo', width: 10 },
      { key: 'email', header: 'Email', width: 35 },
      { key: 'sys_profile_name', header: 'Perfil', width: 25 },
      { key: 'last_sign_in_at', header: 'Último_Ingreso', width: 25 },
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