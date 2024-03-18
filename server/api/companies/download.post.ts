import serverDB from '@/server/utils/db';
import Excel from 'exceljs';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { filter_payload } from '@/types/server/filter_payload'
import { sanitizeSQL } from '@/utils/utils'
import { filter_options, sort_options } from '@/types/server/sys_companies'

export default defineEventHandler( async (event) => {
  try{
    const userSessionId = event.context.user.id;
    await hasUserPermission(userSessionId, PermissionsList.COMPANIES_EXPORT);
    
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
      ? ` and (a.name_es ILIKE '%${search_string}%' or a.name_es_short ILIKE '%${search_string}%' or a.company_number ILIKE '%${search_string}%' )`
      : ''

    const text = `
      select
       a.id
      ,a.company_number
      ,INITCAP(a.name_es) as name_es
      ,INITCAP(a.name_es_short) as name_es_short
      ,a.avatar_url
      ,a.billing_phone
      ,INITCAP(a.billing_address) as billing_address
      ,a.is_active
      ,to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      ,to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      FROM sys_companies a
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
      { key: 'name_es_short', header: 'Organización', width: 25 },
      { key: 'company_number', header: 'RUC', width: 25 },
      { key: 'name_es', header: 'Razón Social', width: 25 },
      { key: 'is_active', header: 'Activo?', width: 25 },
      { key: 'billing_address', header: 'billing_address', width: 35 },
      { key: 'billing_phone', header: 'billing_phone', width: 25 },
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