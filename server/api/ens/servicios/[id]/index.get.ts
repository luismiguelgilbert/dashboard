import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { ens_teams } from '@/types/server/ens/ens_teams';

export default defineEventHandler( async (event) => {
  try{
    event.context.params = useSanitizeParams(event.context.params);
    const id = (event.context.params?.id);
    const text = `SELECT 
       a.id
      ,a.name_es
      ,a.is_active
      ,a.nivel_0
      ,a.nivel_1
      ,a.nivel_2
      ,a.nivel_3
      ,a.nivel_4
      ,a.nivel_5
      ,a.nivel_6
      from ens_teams a
      WHERE a.id = '${id}'
      `;
    // ,to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
    // ,to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
    const data = await serverDB.query(text);
    return array(ens_teams).cast(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});