import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { ens_servicios } from '@/types/server/ens/ens_servicios';
export default defineEventHandler( async () => {
  const data = await serverDB.query(`
    select
     a.id
    ,a.name_es
    ,a.is_active
    from ens_services a
    order by a.name_es
  `);
  return await array(ens_servicios).cast(data.rows);
});