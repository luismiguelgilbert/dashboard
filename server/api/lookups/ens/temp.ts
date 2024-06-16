import serverDB from '@/server/utils/bittDb';
export default defineEventHandler( async () => {
  const data = await serverDB.query(`
    select distinct 
      partnerID as value
      , ltrim(name_es) as label
    from partnerMaster
    order by 2
  `);
  return await data.recordset;
});