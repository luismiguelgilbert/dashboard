import serverDB from '@/server/utils/db';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { ens_servicios } from '@/types/server/ens/ens_servicios';

export default defineEventHandler( async (event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    const userSessionId = event.context.user.id;
    const body = await readBody(event);
    const payload = await ens_servicios.cast(body);
    ens_servicios.validate(body, { strict: false, abortEarly: false });
    await hasUserPermission(userSessionId, PermissionsList.USERS_CREATE);

    //Database actions
    await serverDB.query('BEGIN');

    //Create service
    const sqlUpdateUserData = `insert into ens_services (name_es, is_active, created_at)
      values (
        '${payload.name_es}',
        ${payload.is_active ?? false},
        now()
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