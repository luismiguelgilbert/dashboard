import { array } from 'yup';
import serverDB from '@/server/utils/db'
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { sanitizeSQL } from '@/utils/utils'
import { filter_payload } from '@/types/server/filter_payload'
import { filter_options, sort_options, sys_profiles, type type_sys_profiles } from '@/types/server/sys_profiles'
import type { NuxtError } from '#app';

export default defineEventHandler( async (event) => {
  try {
    const userSessionId = event.context.user.id;
    await hasUserPermission(userSessionId, PermissionsList.ROLES_READ);

    const filter = await readValidatedBody(event, body => filter_payload.parse(body))
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

    const text = `WITH users_by_profile AS (
        select
        int1.sys_profile_id
        , count(int1.user_id) as user_count
        from sys_profiles_users int1
        group by int1.sys_profile_id
      )
      SELECT
          a.id
        , INITCAP(a.name_es) as name_es
        , a.is_active
        , to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        , to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
        , COALESCE(b.user_count,0) as user_count
        ,count(*) OVER() AS row_count
      FROM sys_profiles a
      LEFT JOIN users_by_profile b on a.id = b.sys_profile_id
      WHERE 1 = 1 
      ${filterBy}
      ${filterSearchString}
      ORDER BY ${sortBy}
      OFFSET ${offset}
      LIMIT ${pageSize}
    `
    const data = await serverDB.query(text);
    return array(sys_profiles).cast(data.rows);
  } catch(err: NuxtError | any) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: err.statusCode ?? 500,
      statusMessage: `${err ?? 'Unhandled exception'}`,
    });
  }
})