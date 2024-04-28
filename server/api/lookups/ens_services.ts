import serverDB from '@/server/utils/db';
import { ens_services_lookup, type type_ens_services_lookup } from '@/types/server/ens_types';

export default defineEventHandler( async (event) => {
  try{
    const text = `SELECT
     a.id
    ,initcap(a.name_es) as name_es
    ,a.is_active
    from ens_services a
    order by name_es`;
    const data = await serverDB.query(text);
    const result: type_ens_services_lookup[] = ens_services_lookup.array().parse(data.rows);
    
    return result;
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});