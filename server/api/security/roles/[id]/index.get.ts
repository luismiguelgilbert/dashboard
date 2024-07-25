import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { sys_roles } from '@/types/server/security/sys_roles';

export default defineEventHandler( async (event) => {
  try{
    event.context.params = useSanitizeParams(event.context.params);
    const id = (event.context.params?.id);
    const text = `SELECT 
       a.id
      ,a.name_es
      ,a.is_active
      ,COALESCE((
          SELECT json_agg(
              json_build_object(
                'sys_link_id', int1.sys_link_id
              ) ORDER BY sys_link_id desc)
          FROM sys_profiles_links int1
          WHERE int1.sys_profile_id = '${id}'
      ), '[]'::json) sys_profiles_links
      from sys_profiles a
      WHERE a.id = '${id}'
      `;
    // ,to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
    // ,to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
    const data = await serverDB.query(text);
    return array(sys_roles).cast(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});