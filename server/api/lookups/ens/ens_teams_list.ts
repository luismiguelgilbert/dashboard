import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { ens_teams } from '@/types/server/ens/ens_teams';
export default defineEventHandler( async () => {
  const data = await serverDB.query(`
    select
     a.id
    ,a.name_es
    ,a.nivel_0
    ,a.nivel_1
    ,a.nivel_2
    ,a.nivel_3
    ,a.nivel_4
    ,a.nivel_5
    ,a.nivel_6
    ,a.is_active
    from ens_teams a
    order by a.name_es
  `);
  return await array(ens_teams).cast(data.rows);
});