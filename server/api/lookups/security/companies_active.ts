import serverDB from '@/server/utils/db';
export default defineEventHandler( async () => {
  const data = await serverDB.query(`
    select distinct 
    is_active as value
    ,case is_active when true then 'Activo' else 'Inactivo' end label
    from sys_companies order by 1
  `);
  return await data.rows;
});