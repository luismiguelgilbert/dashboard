import serverDB from '@/server/utils/db';
import { ens_members_lookup, type type_ens_members_lookup } from '@/types/server/ens_types';

export default defineEventHandler( async (event) => {
  try{
    const text = `SELECT
     a.id
    ,concat(initcap(b.user_name), ' ', initcap(b.user_lastname)) as user_full_name
    ,a.es_consiliario
    ,b.avatar_url
    ,b.user_sex
    ,c.email
    from ens_members a
    inner join sys_users b on a.id = b.id
    inner join auth.users c on a.id = c.id
    order by user_full_name`;
    const data = await serverDB.query(text);
    const result: type_ens_members_lookup[] = ens_members_lookup.array().parse(data.rows);
    
    return result;
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});