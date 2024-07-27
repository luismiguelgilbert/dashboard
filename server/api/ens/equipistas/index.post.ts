import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { sanitizeSQL } from '@/utils/utils';
import { filter_payload } from '@/types/server/filter_payload';
import { ens_members, sort_options, filter_options } from '@/types/server/ens/ens_members';
import { type type_filter_selection } from '@/types/client/filter_payload';

export default defineEventHandler( async (event) => {
  try {
    const userSessionId = event.context.user.id;
    await hasUserPermission(userSessionId, PermissionsList.ENSMEMBERS_READ);

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
      ? ` and b.fts @@ to_tsquery('${search_string}:*')`
      : '';

    const text = `
      SELECT
          a.id
        , INITCAP(b.user_name) as user_name
        , INITCAP(b.user_lastname) as user_lastname
        , b.website as email
        , b.avatar_url
        , a.is_active
        , INITCAP(p2.user_name || ' ' || p2.user_lastname) as partner_full_name
        , count(*) OVER() AS row_count
        from ens_members a
        inner join sys_users b on a.id = b.id
        inner join ens_members p1 on a.partner_id = p1.id
        inner join sys_users p2 on p1.id = p2.id
      WHERE 1 = 1 
        ${filterQueryString}
        ${filterSearchString}
        ORDER BY ${sortBy} ${sortByOrder ? 'ASC' : 'DESC'}
        OFFSET ${offset}
        LIMIT ${pageSize}
    `;
    const data = await serverDB.query(text);
    return array(ens_members).cast(data.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    await serverDB.query('ROLLBACK');
    throw createError({ statusCode: 500, statusMessage: String(err) ?? 'Unhandled exception' });
  }
});