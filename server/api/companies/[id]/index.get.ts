import serverDB from '@/server/utils/db';
import { sys_companies, type type_sys_companies } from '@/types/server/sys_companies'

export default defineEventHandler( async (event) => {
  try{
    const id = (event.context.params?.id);
    const text = `SELECT 
        a.id
      ,a.company_number
      ,a.name_es
      ,a.name_es_short
      ,a.billing_phone
      ,a.billing_address
      ,a.is_active
      ,a.avatar_url
      ,to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      ,to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      FROM sys_companies a
      WHERE a.id = '${id}'
    `;
    const data = await serverDB.query(text);
    const result: type_sys_companies[] = sys_companies.array().parse(data.rows);
    
    return result;
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });

  }
});