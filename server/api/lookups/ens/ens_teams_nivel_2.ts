import serverDB from '@/server/utils/db';
export default defineEventHandler( async () => {
  const data = await serverDB.query(`
    select distinct
    nivel_2 as value
    , nivel_2 as label
    from ens_teams order by 1
  `);
  return await data.rows;
});