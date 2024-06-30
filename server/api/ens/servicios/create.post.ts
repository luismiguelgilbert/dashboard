import serverDB from '@/server/utils/db';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { ens_teams } from '@/types/server/ens/ens_teams';

export default defineEventHandler( async (event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    const userSessionId = event.context.user.id;
    const body = await readBody(event);
    const payload = await ens_teams.cast(body);
    ens_teams.validate(body, { strict: false, abortEarly: false });
    await hasUserPermission(userSessionId, PermissionsList.ENSTEAMS_CREATE);

    //Database actions
    await serverDB.query('BEGIN');

    //Create team
    const sqlUpdateUserData = `insert into ens_teams (name_es, is_active, nivel_0, nivel_1, nivel_2, nivel_3, nivel_4, nivel_5, nivel_6, updated_by)
      values (
        '${payload.name_es}',
        ${payload.is_active ?? false},
        '${payload.nivel_0}',
        '${payload.nivel_1}',
        '${payload.nivel_2}',
        '${payload.nivel_3}',
        '${payload.nivel_4}',
        '${payload.nivel_5}',
        '${payload.nivel_6}',
        '${userSessionId}'
      ) RETURNING id`;
    const { rows } = await serverDB.query(sqlUpdateUserData);
    await serverDB.query('COMMIT');
    
    const id = rows[0].id;
    return { id: id };
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    await serverDB.query('ROLLBACK');
    throw createError({ statusCode: 500, statusMessage: String(err) ?? 'Unhandled exception' });
  }
});