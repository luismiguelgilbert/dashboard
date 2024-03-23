import serverDB from '@/server/utils/db'
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { sanitizeSQL } from '@/utils/utils'
import { filter_payload } from '@/types/server/filter_payload'
import { filter_options, sort_options, sys_profiles, type type_sys_profiles } from '@/types/server/sys_profiles'
import type { NuxtError } from '#app';

export default defineEventHandler( async (event) => {
  try{
    // const sys_company_id = (event.context.params?.sys_company_id) ?? 'abc';
    // console.log('sys_company_id', sys_company_id)
    const userSessionId = event.context.user.id;
    await hasUserPermission(userSessionId, PermissionsList.INVTYPES_READ);

    const filter = await readValidatedBody(event, body => filter_payload.parse(body))
    const sys_company_id = filter.sys_company_id;
    const sortById = Number(filter.sortBy)
    const sortBy: string = sort_options.find(x => x.value === sortById)?.sqlValue ?? sort_options[0].sqlValue
    const page = Number(filter.page)
    const pageSize = Number(filter.pageSize)
    const offset = pageSize * (page - 1)
    const filterConditions: Array<string> = []
    filter_options.forEach(x => {
      if (filter.filterBy.includes(x.value)) {
        filterConditions.push(x.sqlValue)
      }
    })
    const filterBy = filterConditions.length ? ` AND (${filterConditions.join(' or ')})` : ''
    const search_string = sanitizeSQL(filter.searchString)
    const filterSearchString = search_string.length > 0
      ? ` and (a.name_es ILIKE '%${search_string}%' )` 
      : ''

    const text = `SELECT
          a.id
        , INITCAP(a.name_es) as name_es
        , a.is_active
        , to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        , to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
        , count(*) OVER() AS row_count
      FROM inv_types a
      WHERE a.sys_company_id = '${sys_company_id}'
      ${filterBy}
      ${filterSearchString}
      ORDER BY ${sortBy}
      OFFSET ${offset}
      LIMIT ${pageSize}
    `
    console.log(text)
    const data = await serverDB.query(text)
    // const result: type_sys_profiles[] = sys_profiles.array().parse(data.rows)
    const result = data.rows;
    
    return result
  } catch(err: NuxtError | any) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: err.statusCode ?? 500,
      statusMessage: `${err ?? 'Unhandled exception'}`,
    });
  }
})