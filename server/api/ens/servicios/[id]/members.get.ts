import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { ens_members } from '@/types/server/ens/ens_members';

export default defineEventHandler( async (event) => {
  try{
    event.context.params = useSanitizeParams(event.context.params);
    const id = getRouterParam(event, 'id');
    const text = `SELECT
      b.id
      ,c.user_name
      ,c.user_lastname
      ,concat(c.user_name, ' ', c.user_lastname) as user_full_name
      ,d.email
      ,c.user_sex
      ,c.avatar_url
      ,concat(e.user_name, e.user_lastname) as partner_full_name
      ,b.fecha_matrimonio
      ,b.fecha_nacimiento
      ,b.is_active
      ,b.es_consiliario
      ,b.created_at
      ,b.updated_at
      ,0 as row_count
      from ens_members_services a
      inner join ens_members b on a.user_id = b.id
      inner join sys_users c on b.id = c.id
      inner join auth.users d on c.id = d.id
      left join sys_users e on e.id = b.partner_id
      where a.service_id = '${id}'
      and a.date_start < now() 
      and (a.date_stop is null or a.date_stop > now())
      order by a.date_start desc
    `;
    const data = await serverDB.query(text);
    return array(ens_members).cast(data.rows);
    
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});