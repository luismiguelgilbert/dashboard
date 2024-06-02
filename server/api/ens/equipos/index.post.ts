import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { sanitizeSQL } from '@/utils/utils';
import { filter_payload } from '@/types/server/filter_payload';
import { teams_sort_options, ens_teams } from '@/types/server/ens_teams';
import { FilterQueriesKeys } from '~/types/server/filter_search_queries';

export default defineEventHandler( async (event) => {
  try{
    const userSessionId = event.context.user.id;
    await hasUserPermission(userSessionId, PermissionsList.ROLES_READ);

    const filter = await readValidatedBody(event, body => filter_payload.cast(body));
    const sortById = Number(filter.sortBy);
    const sortBy: string = teams_sort_options.find(x => x.value === sortById)?.sqlValue ?? teams_sort_options[0].sqlValue;
    const sortByOrder = Boolean(filter.sortByOrder);
    const page = Number(filter.page);
    const pageSize = Number(filter.pageSize);
    const offset = pageSize * (page - 1);
    let filterQuery = '';
    filter.filterBy
      .filter(x =>  x.options && x.options.length > 0)
      .forEach(userFilter => {
        if (userFilter.key === FilterQueriesKeys.ENS_TEAM_ACTIVE) { 
          filterQuery += ' AND a.is_active in (';
          userFilter.options?.forEach(option => {
            filterQuery += option;
          });
          filterQuery += ') ';
        }
        if (userFilter.key === FilterQueriesKeys.ENS_TEAM_NIVEL_0) { 
          filterQuery += ' AND a.nivel_0 in (';
          userFilter.options?.forEach(option => {
            filterQuery += `'${option}',`;
          });
          filterQuery += ') ';
        }
        if (userFilter.key === FilterQueriesKeys.ENS_TEAM_NIVEL_1) { 
          filterQuery += ' AND a.nivel_1 in (';
          userFilter.options?.forEach(option => {
            filterQuery += `'${option}',`;
          });
          filterQuery += ') ';
        }
        if (userFilter.key === FilterQueriesKeys.ENS_TEAM_NIVEL_2) { 
          filterQuery += ' AND a.nivel_2 in (';
          userFilter.options?.forEach(option => {
            filterQuery += `'${option}',`;
          });
          filterQuery += ') ';
        }
    });
    filterQuery = filterQuery.replaceAll(',)', ')');    
    const search_string = sanitizeSQL(filter.searchString);
    const filterSearchString = search_string.length > 0
      ? ` and (a.name_es ILIKE '%${search_string}%' or a.nivel_0 ILIKE '%${search_string}%' or a.nivel_1 ILIKE '%${search_string}%' or a.nivel_2 ILIKE '%${search_string}%' or a.nivel_3 ILIKE '%${search_string}%' or a.nivel_4 ILIKE '%${search_string}%' or a.nivel_5 ILIKE '%${search_string}%' or a.nivel_6 ILIKE '%${search_string}%' )`
      : '';

    const text = `
      SELECT
          a.id
        , INITCAP(a.name_es) as name_es
        , a.is_active
        , INITCAP(a.nivel_0) as nivel_0
        , INITCAP(a.nivel_1) as nivel_1
        , INITCAP(a.nivel_2) as nivel_2
        , INITCAP(a.nivel_3) as nivel_3
        , INITCAP(a.nivel_4) as nivel_4
        , INITCAP(a.nivel_5) as nivel_5
        , INITCAP(a.nivel_6) as nivel_6
        , to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        , to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
        , count(*) OVER() AS row_count
      FROM ens_teams a
      WHERE 1 = 1 
      ${filterQuery}
      ${filterSearchString}
      ORDER BY ${sortBy} ${sortByOrder ? 'ASC' : 'DESC'}
      OFFSET ${offset}
      LIMIT ${pageSize}
    `;
    console.log(text);
    const data = await serverDB.query(text);
    return array(ens_teams).cast(data.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    await serverDB.query('ROLLBACK');
    throw createError({ statusCode: 500, statusMessage: String(err) ?? 'Unhandled exception' });
  }
});