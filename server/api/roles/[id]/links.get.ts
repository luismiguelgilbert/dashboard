import serverDB from '@/server/utils/db';
// import { sys_profiles, type type_sys_profiles } from '@/types/server/sys_profiles'

export default defineEventHandler( async (event) => {
  try{
    const id = (event.context.params?.id);
    const text = `SELECT 
      a.sys_link_id
      from sys_profiles_links a
      WHERE a.sys_profile_id = '${id}'
    `;
    const data = await serverDB.query(text);
    // const result: type_sys_profiles[] = sys_profiles.array().parse(data.rows);
    const result = data.rows;
    
    return result;
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});