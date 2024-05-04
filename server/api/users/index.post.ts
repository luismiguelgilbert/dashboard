import serverDB from '@/server/utils/db'
import { array } from 'yup';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { sanitizeSQL } from '@/utils/utils'
import { filter_payload } from '@/types/server/filter_payload'
import { filter_options, sort_options, sys_users, type type_sys_users } from '@/types/server/sys_users'
import type { NuxtError } from '#app';

export default defineEventHandler( async (event) => {
  try{
    const userSessionId = event.context.user.id;
    await hasUserPermission(userSessionId, PermissionsList.USERS_READ);

    const filter = await readValidatedBody(event, body => filter_payload.cast(body))
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
      coalesce(c.sys_profile_id, 0) as sys_profile_id,
      INITCAP(coalesce(d.name_es, '...')) as sys_profile_name,
      to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at,
      to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at,
      to_char (a.last_sign_in_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as last_sign_in_at,
      count(*) OVER() AS row_count
      from auth.users a
      left join sys_users b on a.id = b.id
      left join sys_profiles_users c on c.user_id = a.id
      left join sys_profiles d on c.sys_profile_id = d.id
      WHERE 1 = 1
      ${filterBy}
      ${filterSearchString}
      ORDER BY ${sortBy}
      OFFSET ${offset}
      LIMIT ${pageSize}
    `
    const data = await serverDB.query(text);
    return array(sys_users).cast(data.rows);
  } catch(err: NuxtError | any) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: err.statusCode ?? 500,
      statusMessage: `${err ?? 'Unhandled exception'}`,
    });
  }
})