import serverDB from '@/server/utils/db';
export default defineEventHandler( async () => {
  const data = await serverDB.query(`
    select distinct
    name_es as value
    , name_es as label
    from ens_teams order by 1
  `);
  return await data.rows;
});