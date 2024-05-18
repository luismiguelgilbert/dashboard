import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { roleUser } from '@/types/server/sys_profiles';

export default defineEventHandler( async (event) => {
  try{
    event.context.params = useSanitizeParams(event.context.params);
    const id = (event.context.params?.id);
    const text = `SELECT
      c.id
      ,c.user_name
      ,c.user_lastname
      ,c.avatar_url
      ,c.user_sex
      ,d.email
      from sys_profiles a
      inner join sys_profiles_users b on a.id = b.sys_profile_id
      inner join sys_users c on b.user_id = c.id
      inner join auth.users d on d.id = c.id
      WHERE a.id = '${id}'
    `;
    const data = await serverDB.query(text);
    return array(roleUser).cast(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});