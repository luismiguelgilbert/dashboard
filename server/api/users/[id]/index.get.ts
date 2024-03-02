import serverDB from '@/server/utils/db';
import { sys_users, type type_sys_users } from '@/types/server/sys_users'

export default defineEventHandler( async (event) => {
  try{
    const id = (event.context.params?.id);
    const text = `SELECT
      a.id,
      b.user_name,
      b.user_lastname,
      b.avatar_url,
      b.website,
      a.email,
      c.sys_profile_id,
      d.name_es as sys_profile_name,
      to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at,
      to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at,
      to_char (a.last_sign_in_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as last_sign_in_at,
      count(*) OVER() AS row_count
      from auth.users a
      left join sys_users b on a.id = b.id
      left join sys_profiles_users c on c.user_id = a.id
      left join sys_profiles d on c.sys_profile_id = d.id
      WHERE a.id = '${id}'
    `;
    const data = await serverDB.query(text);
    const result: type_sys_users[] = sys_users.array().parse(data.rows);
    
    return result;
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });

  }
});