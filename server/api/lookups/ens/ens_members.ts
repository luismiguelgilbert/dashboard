import serverDB from '@/server/utils/db';
export default defineEventHandler( async () => {
  const data = await serverDB.query(`
    select
     a.id
    ,INITCAP(b.user_name || ' ' || b.user_lastname) as full_name
    from ens_members a
    inner join sys_users b on a.id = b.id
  `);
  return await data.rows;
});