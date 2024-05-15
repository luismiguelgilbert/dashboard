import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { userDataForm } from '@/types/server/sys_users';

export default defineEventHandler( async (event) => {
  try{
    event.context.params = useSanitizeParams(event.context.params);
    const id = (event.context.params?.id);
    const text = `WITH user_company AS (
          select
          int1.id as user_id
          ,int3.id as sys_company_id
          ,int2.is_default
          from sys_users int1
          inner join sys_companies_users int2 on int2.user_id = int1.id
          inner join sys_companies int3 on int3.id = int2.sys_company_id
          WHERE int1.id = '${id}'
          order by int2.is_default desc, int3.name_es_short
          limit 1
        )
      SELECT
      a.id,
      b.user_name,
      b.user_lastname,
      b.user_sex,
      b.avatar_url,
      b.website,
      a.email,
      c.sys_profile_id,
      d.name_es as sys_profile_name,
      b.dark_enabled,
      b.default_color,
      b.default_dark_color,
      e.sys_company_id as prefered_company_id
      from auth.users a
      left join sys_users b on a.id = b.id
      left join sys_profiles_users c on c.user_id = a.id
      left join sys_profiles d on c.sys_profile_id = d.id
      left join user_company e on e.user_id = a.id
      WHERE a.id = '${id}'
      `;
      // to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at,
      // to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at,
      // to_char (a.last_sign_in_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as last_sign_in_at
      // count(*) OVER() AS row_count
    const data = await serverDB.query(text);
    return array(userDataForm).cast(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });

  }
});