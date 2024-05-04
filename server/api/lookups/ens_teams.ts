import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { ens_teams_lookup } from '@/types/server/ens_types';

export default defineEventHandler( async (event) => {
  try{
    const text = `SELECT
     a.id
    ,initcap(a.name_es) as name_es
    ,a.is_active
    from ens_teams a
    order by a.name_es`;
    const data = await serverDB.query(text);
    return array(ens_teams_lookup).cast(data.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});