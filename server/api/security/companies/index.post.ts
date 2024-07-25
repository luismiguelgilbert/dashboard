import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { sanitizeSQL } from '@/utils/utils';
import { filter_payload } from '@/types/server/filter_payload';
import { sys_companies, sort_options, filter_options } from '@/types/server/security/sys_companies';
import { type type_filter_selection } from '@/types/client/filter_payload';

export default defineEventHandler( async (event) => {
  try {
    const userSessionId = event.context.user.id;
    await hasUserPermission(userSessionId, PermissionsList.COMPANIES_READ);

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
      ? ` and a.fts @@ to_tsquery('${search_string.replaceAll(' ','+') }:*')`
      : '';
    const text = `
      WITH users_by_company AS (
        select
          sys_company_id
          , count(*) as user_count
        from sys_companies_users int1
        group by int1.sys_company_id
      )
      select
        a.id
        , a.company_number
        , INITCAP(a.name_es) as name_es
        , INITCAP(a.name_es_short) as name_es_short
        , a.avatar_url
        , COALESCE(a.billing_phone,'') as billing_phone
        , COALESCE(INITCAP(a.billing_address),'') as billing_address
        , a.is_active
        , to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        , to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
        , count(*) OVER() AS row_count
        , COALESCE(b.user_count,0) as user_count
      FROM sys_companies a
      LEFT JOIN users_by_company b on a.id = b.sys_company_id
      WHERE 1 = 1 
        ${filterQueryString}
        ${filterSearchString}
        ORDER BY ${sortBy} ${sortByOrder ? 'ASC' : 'DESC'}
        OFFSET ${offset}
        LIMIT ${pageSize}
    `;
    const data = await serverDB.query(text);
    return array(sys_companies).cast(data.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    await serverDB.query('ROLLBACK');
    throw createError({ statusCode: 500, statusMessage: String(err) ?? 'Unhandled exception' });
  }
});