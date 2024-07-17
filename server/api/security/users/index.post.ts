import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { sanitizeSQL } from '@/utils/utils';
import { filter_payload } from '@/types/server/filter_payload';
import { sys_users, sort_options, filter_options } from '@/types/server/security/sys_users';
import { type type_filter_selection } from '@/types/client/filter_payload';

export default defineEventHandler( async (event) => {
  try {
    const userSessionId = event.context.user.id;
    await hasUserPermission(userSessionId, PermissionsList.USERS_READ);

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
    
    const page = Number(filter.page);
    const pageSize = Number(filter.pageSize);
    const offset = pageSize * (page - 1);
    const search_string = sanitizeSQL(filter.searchString);
    const filterSearchString = search_string.length > 0
      ? ` and fts @@ to_tsquery('${search_string.replaceAll(' ','+') }:*')`
      : '';

    const text = `select
      a.id,
      COALESCE(INITCAP(b.user_name),'') as user_name,
      COALESCE(INITCAP(b.user_lastname),'') as user_lastname,
      COALESCE(b.user_sex, false) as user_sex,
      b.avatar_url,
      b.website,
      a.email,
      coalesce(b.sys_profile_id, 0) as sys_profile_id,
      INITCAP(coalesce(d.name_es, '...')) as sys_profile_name,
      to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at,
      to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at,
      to_char (a.last_sign_in_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as last_sign_in_at,
      count(*) OVER() AS row_count
      from auth.users a
      left join sys_users b on a.id = b.id
      left join sys_profiles d on b.sys_profile_id = d.id
      WHERE 1 = 1 
        ${filterQueryString}
        ${filterSearchString}
        ORDER BY ${sortBy} ${sortByOrder ? 'ASC' : 'DESC'}
        OFFSET ${offset}
        LIMIT ${pageSize}
    `;
    const data = await serverDB.query(text);
    return array(sys_users).cast(data.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    await serverDB.query('ROLLBACK');
    throw createError({ statusCode: 500, statusMessage: String(err) ?? 'Unhandled exception' });
  }
});