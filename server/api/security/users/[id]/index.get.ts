import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { sys_users } from '@/types/server/security/sys_users';

export default defineEventHandler( async (event) => {
  try{
    event.context.params = useSanitizeParams(event.context.params);
    const id = (event.context.params?.id);
    const text = `
      SELECT
      a.id,
      COALESCE(b.user_name, '') as user_name,
      COALESCE(b.user_lastname, '') as user_lastname,
      COALESCE(b.user_sex, false) as user_sex,
      b.avatar_url,
      b.website,
      a.email,
      c.sys_profile_id,
      d.name_es as sys_profile_name,
      b.dark_enabled,
      b.default_color,
      b.default_dark_color,
      COALESCE((
          SELECT json_agg(
              json_build_object(
                  'sys_company_id', int1.sys_company_id,
                  'is_default', int1.is_default
              ) ORDER BY is_default desc)
          FROM sys_companies_users int1
          WHERE int1.user_id = '${id}'
      ), '[]'::json) sys_companies_users
      from auth.users a
      left join sys_users b on a.id = b.id
      left join sys_profiles_users c on c.user_id = a.id
      left join sys_profiles d on c.sys_profile_id = d.id
      WHERE a.id = '${id}'
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