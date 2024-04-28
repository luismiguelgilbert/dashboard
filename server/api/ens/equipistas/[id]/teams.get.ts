import serverDB from '@/server/utils/db';
import { ens_members_teams, type type_ens_members_teams } from '@/types/server/ens_types';

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
    const result: type_ens_members_teams[] = ens_members_teams.array().parse(data.rows);
    
    return result;
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});