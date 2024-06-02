import serverDB from '@/server/utils/db';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { ens_teams } from '@/types/server/ens_teams';

export default defineEventHandler( async (event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    const id = getRouterParam(event, 'id');
    const userSessionId = event.context.user.id;
    const body = await readBody(event);
    const payload = await ens_teams.cast(body);
    ens_teams.validate(body, { strict: false, abortEarly: false });
    await hasUserPermission(userSessionId, PermissionsList.ENSTEAMS_EDIT);

    //Database actions
    await serverDB.query('BEGIN');

    //Update specific profile data
    const sqlUpdateUserData = `update ens_teams set
       name_es = COALESCE('${payload.name_es}', name_es)
      ,is_active = COALESCE(${payload.is_active ?? false}, is_active)
      ,nivel_0 = COALESCE('${payload.nivel_0}', nivel_0)
      ,nivel_1 = COALESCE('${payload.nivel_1}', nivel_1)
      ,nivel_2 = COALESCE('${payload.nivel_2}', nivel_2)
      ,nivel_3 = COALESCE('${payload.nivel_3}', nivel_3)
      ,nivel_4 = COALESCE('${payload.nivel_4}', nivel_4)
      ,nivel_5 = COALESCE('${payload.nivel_5}', nivel_5)
      ,nivel_6 = COALESCE('${payload.nivel_6}', nivel_6)
      ,updated_at = now()
      ,updated_by = '${userSessionId}'
      WHERE id = '${id}'`;
    await serverDB.query(sqlUpdateUserData);
    
    await serverDB.query('COMMIT');
    return { id: id };
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    await serverDB.query('ROLLBACK');
    throw createError({ statusCode: 500, statusMessage: String(err) ?? 'Unhandled exception' });
  }
});