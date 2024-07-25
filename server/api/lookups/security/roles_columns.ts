import { array } from 'yup';
import { roles_columns } from '@/types/server/lookups/roles_columns';

import serverDB from '@/server/utils/db';
export default defineEventHandler( async () => {
  const data = await serverDB.query(`
    select
     r.id as root_id
    ,r.name_es as root_name_es
    ,r.icon
    ,a.id as page_id
    ,a.name_es as page_name_es
    ,(select count(*) from sys_links y where y.parent = a.id) as columns_count
    ,COALESCE((
        SELECT json_agg(
            json_build_object(
              'id', int1.id,
              'name_es', int1.name_es,
              'icon', int1.icon
            ) ORDER BY id desc)
        FROM sys_links int1
        WHERE int1.row_level = 2 and int1.parent = a.id
    ), '[]'::json) permissions
    from sys_links a
    inner join sys_links r on a.parent = r.id
    where a.row_level = 1
    group by r.id, a.id, a.name_es
    order by a.id
  `);
  return array(roles_columns).cast(data.rows);
});