import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { sanitizeSQL } from '@/utils/utils';
import { filter_payload } from '@/types/server/filter_payload';
import { filter_options, sort_options, sys_companies } from '@/types/server/sys_companies';

export default defineEventHandler( async (event) => {
  try{
    const userSessionId = event.context.user.id;
    await hasUserPermission(userSessionId, PermissionsList.USERS_READ);

    const filter = await readValidatedBody(event, body => filter_payload.cast(body));
    const sortById = Number(filter.sortBy);
    const sortBy: string = sort_options.find(x => x.value === sortById)?.sqlValue ?? sort_options[0].sqlValue;
    const page = Number(filter.page);
    const pageSize = Number(filter.pageSize);
    const offset = pageSize * (page - 1);
    const filterConditions: Array<string> = [];
    filter_options.forEach(x => {
      if (filter.filterBy.includes(x.value)) {
        filterConditions.push(x.sqlValue);
      }
    });
    const filterBy = filterConditions.length ? ` AND (${filterConditions.join(' or ')})` : '';
    const search_string = sanitizeSQL(filter.searchString);
    const filterSearchString = search_string.length > 0
      ? ` and (a.name_es ILIKE '%${search_string}%' or a.name_es_short ILIKE '%${search_string}%' or a.company_number ILIKE '%${search_string}%' )` 
      : '';

    const text = `WITH users_by_company AS (
        select
        int1.sys_company_id
        , count(int1.sys_company_id) as user_count
        from sys_companies_users int1
        group by int1.sys_company_id
      )
      SELECT 
          a.id
        , a.company_number
        , INITCAP(a.name_es) as name_es
        , INITCAP(a.name_es_short) as name_es_short
        , a.avatar_url
        , a.billing_phone
        , INITCAP(a.billing_address) as billing_address
        , a.is_active
        , to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        , to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
        , count(*) OVER() AS row_count
        , COALESCE(b.user_count,0) as user_count
      FROM sys_companies a
      LEFT JOIN users_by_company b on a.id = b.sys_company_id
      WHERE 1 = 1
      ${filterBy}
      ${filterSearchString}
      ORDER BY ${sortBy}
      OFFSET ${offset}
      LIMIT ${pageSize}
    `;
    const data = await serverDB.query(text);
    return array(sys_companies).cast(data.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: err.statusCode ?? 500,
      statusMessage: `${err ?? 'Unhandled exception'}`,
    });
  }
});