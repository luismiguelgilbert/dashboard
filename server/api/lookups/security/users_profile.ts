import serverDB from '@/server/utils/db';
export default defineEventHandler( async () => {
  const data = await serverDB.query(`
    select distinct
    id as value
    ,name_es label
    from sys_profiles order by 2
  `);
  return await data.rows;
});