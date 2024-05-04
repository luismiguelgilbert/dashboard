import serverDB from '@/server/utils/db'
import { array } from 'yup';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { sanitizeSQL } from '@/utils/utils'
import { filter_payload } from '@/types/server/filter_payload'
import { filter_options, sort_options, ens_members, type type_ens_members } from '@/types/server/ens_types'
import type { NuxtError } from '#app';

export default defineEventHandler( async (event) => {
  try{
    const userSessionId = event.context.user.id;
    await hasUserPermission(userSessionId, PermissionsList.ENSMEMBERS_READ);

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
      ? ` and (concat(b.user_name, ' ', b.user_lastname) ILIKE '%${search_string}%' or bb.email ILIKE '%${search_string}%' )` 
      : ''

    const text = `
      SELECT
        a.id
        ,INITCAP(concat(b.user_name, ' ', b.user_lastname)) as user_full_name
        ,bb.email
        ,b.user_sex
        ,b.avatar_url
        ,INITCAP(concat(c.user_name, ' ', c.user_lastname)) as partner_full_name
        ,a.fecha_matrimonio
        ,a.fecha_nacimiento
        ,a.is_active
        ,a.es_consiliario
        , to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        , to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
        , count(*) OVER() AS row_count
      from ens_members a
      left join sys_users b on a.id = b.id
      left join auth.users bb on bb.id = b.id
      left join sys_users c on a.partner_id = c.id
      WHERE 1 = 1 
      ${filterBy}
      ${filterSearchString}
      ORDER BY ${sortBy}
      OFFSET ${offset}
      LIMIT ${pageSize}
    `
    const data = await serverDB.query(text);
    return array(ens_members).cast(data.rows);
  } catch(err: NuxtError | any) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: err.statusCode ?? 500,
      statusMessage: `${err ?? 'Unhandled exception'}`,
    });
  }
})