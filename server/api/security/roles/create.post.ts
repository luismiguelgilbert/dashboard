import serverDB from '@/server/utils/db';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { sys_roles } from '@/types/server/security/sys_roles';

export default defineEventHandler( async (event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    const userSessionId = event.context.user.id;
    const body = await readBody(event);
    const payload = await sys_roles.cast(body);
    sys_roles.validate(body, { strict: false, abortEarly: false });
    await hasUserPermission(userSessionId, PermissionsList.ROLES_CREATE);

    //Database actions
    await serverDB.query('BEGIN');

    //Create role
    const sqlUpdateUserData = `insert into sys_profiles (name_es, is_active, updated_by)
      values (
        '${payload.name_es}',
        ${payload.is_active ?? false},
        '${userSessionId}'
      ) RETURNING id`;
    const { rows } = await serverDB.query(sqlUpdateUserData);
    await serverDB.query('COMMIT');
    
    const id = rows[0].id;

    //Add links
    let sqlLinksInsert = 'insert into sys_profiles_links (sys_profile_id, sys_link_id) values';
    payload.sys_profiles_links?.forEach((link) => {
      sqlLinksInsert += `(${id}, '${link.sys_link_id}'),`;
    });
    sqlLinksInsert = sqlLinksInsert.substring(0, sqlLinksInsert.length - 1);//remove last comma
    await serverDB.query(sqlLinksInsert);

    return { id: id };
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    await serverDB.query('ROLLBACK');
    throw createError({ statusCode: 500, statusMessage: String(err) ?? 'Unhandled exception' });
  }
});