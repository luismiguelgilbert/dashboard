import serverDB from '@/server/utils/db';
export default defineEventHandler( async () => {
  const data = await serverDB.query(`
    select distinct
    user_sex as value
    ,case user_sex when true then 'Hombre' else 'Mujer' end label
    from sys_users order by 1
  `);
  return await data.rows;
});