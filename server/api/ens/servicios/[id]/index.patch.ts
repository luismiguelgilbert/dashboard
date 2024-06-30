import serverDB from '@/server/utils/db';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { ens_servicios } from '@/types/server/ens/ens_servicios';

export default defineEventHandler( async (event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    const id = getRouterParam(event, 'id');
    const userSessionId = event.context.user.id;
    const body = await readBody(event);
    const payload = await ens_servicios.cast(body);
    ens_servicios.validate(body, { strict: false, abortEarly: false });
    await hasUserPermission(userSessionId, PermissionsList.ENSSERVICIOS_EDIT);

    //Database actions
    await serverDB.query('BEGIN');

    //Update specific profile data
    const sqlUpdateUserData = `update ens_services set
       name_es = COALESCE('${payload.name_es}', name_es)
      ,is_active = COALESCE(${payload.is_active ?? false}, is_active)
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