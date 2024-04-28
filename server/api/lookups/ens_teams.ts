import serverDB from '@/server/utils/db';
import { ens_teams_lookup, type type_ens_teams_lookup } from '@/types/server/ens_types';

export default defineEventHandler( async (event) => {
  try{
    const text = `SELECT
     a.id
    ,initcap(a.name_es) as name_es
    ,a.is_active
    from ens_teams a
    order by a.name_es`;
    const data = await serverDB.query(text);
    const result: type_ens_teams_lookup[] = ens_teams_lookup.array().parse(data.rows);
    
    return result;
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});