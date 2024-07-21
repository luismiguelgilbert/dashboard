import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { sys_users } from '@/types/server/security/sys_users';

export default defineEventHandler( async (event) => {
  try{
    event.context.params = useSanitizeParams(event.context.params);
    const id = (event.context.params?.id);
    const text = `SELECT
      a.id
      ,a.user_name
      ,a.user_lastname
      ,b.email
      ,a.user_sex
      ,a.avatar_url
      ,a.sys_profile_id
      ,c.name_es as sys_profile_name
      ,a.dark_enabled
      ,a.default_color
      ,a.default_dark_color
      ,'' as prefered_company_id
      ,b.created_at
      ,a.updated_at
      ,b.last_sign_in_at
      ,0
      from sys_users a
      inner join auth.users b on a.id = b.id
      inner join sys_profiles c on a.sys_profile_id = c.id
      where a.sys_profile_id = '${id}'
    `;
    const data = await serverDB.query(text);
    return array(sys_users).cast(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});