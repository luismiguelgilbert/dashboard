import serverDB from '@/server/utils/db';
import Excel from 'exceljs';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { filter_payload } from '@/types/server/filter_payload'
import { sanitizeSQL } from '@/utils/utils'
import { filter_options, sort_options } from '@/types/server/sys_users'

export default defineEventHandler( async (event) => {
  try{
    const userSessionId = event.context.user.id;
    await hasUserPermission(userSessionId, PermissionsList.USERS_EXPORT);
    
    const filter = await readValidatedBody(event, body => filter_payload.parse(body))
    const sortById = Number(filter.sortBy)
    const sortBy: string = sort_options.find(x => x.value === sortById)?.sqlValue ?? sort_options[0].sqlValue
    const filterConditions: Array<string> = []
    filter_options.forEach(x => {
      if (filter.filterBy.includes(x.value)) {
        filterConditions.push(x.sqlValue)
      }
    })
    const filterBy = filterConditions.length ? ` AND (${filterConditions.join(' or ')})` : ''
    const search_string = sanitizeSQL(filter.searchString)
    const filterSearchString = search_string.length > 0
      ? ` and (b.user_name ILIKE '%${search_string}%' or b.user_lastname ILIKE '%${search_string}%' or a.email ILIKE '%${search_string}%' )` 
      : ''

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
      left join sys_profiles_users c on c.user_id = a.id
      left join sys_profiles d on c.sys_profile_id = d.id
      WHERE 1 = 1
      ${filterBy}
      ${filterSearchString}
      ORDER BY ${sortBy}
    `
    const data = await serverDB.query(text);
    const workbook = new Excel.Workbook();
    const worksheet = await workbook.addWorksheet('Usuarios');
    const fileColumns = [
      { key: 'id', header: 'Código', width: 50  },
      { key: 'user_name', header: 'Nombres', width: 25 },
      { key: 'user_lastname', header: 'Apellidos', width: 25 },
      { key: 'user_sex', header: 'Sexo', width: 25 },
      { key: 'email', header: 'email', width: 35 },
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
    console.error(`Error at ${event.path}. ${err}`)
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    })
  }
});