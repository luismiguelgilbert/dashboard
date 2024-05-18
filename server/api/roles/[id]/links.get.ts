import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { roleLinks } from '@/types/server/sys_profiles';

export default defineEventHandler( async (event) => {
  try{
    event.context.params = useSanitizeParams(event.context.params);
    const id = (event.context.params?.id);
    const text = `SELECT 
      a.sys_link_id
      from sys_profiles_links a
      WHERE a.sys_profile_id = '${id}'
    `;
    const data = await serverDB.query(text);
    return array(roleLinks).cast(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});