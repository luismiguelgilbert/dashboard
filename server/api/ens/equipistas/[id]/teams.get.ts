import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { ens_members_teams } from '@/types/server/ens_types';

export default defineEventHandler( async (event) => {
  try{
    const id = (event.context.params?.id);
    const text = `SELECT
      a.id
      ,a.user_id
      ,a.team_id
      ,b.name_es as team_name_es
      ,a.fecha_pilotaje
      ,a.fecha_alianza
      ,a.fecha_salida
      from ens_members_teams a
      inner join ens_teams b on a.team_id = b.id
      WHERE a.user_id = '${id}'
    `;
    const data = await serverDB.query(text);
    return array(ens_members_teams).cast(data.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});