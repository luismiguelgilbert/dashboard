import serverDB from '@/server/utils/db';
export default defineEventHandler( async () => {
  const data = await serverDB.query(`
    select distinct
    nivel_1 as value
    , nivel_1 as label
    from ens_teams order by 1
  `);
  return await data.rows;
});