import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { sys_companies } from '@/types/server/lookups/security_sys_companies';

export default defineEventHandler( async (event) => {
  try{
    
    const text = `SELECT
      a.id
      , a.company_number
      , INITCAP(a.name_es) as name_es
      , INITCAP(a.name_es_short) as name_es_short
      , a.billing_phone
      , a.billing_address
      , a.is_active
      , a.avatar_url
      , to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      , to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      , count(*) OVER() AS row_count
    FROM sys_companies a
    order by a.name_es
    `;
    const data = await serverDB.query(text);
    return array(sys_companies).cast(data.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});