import serverDB from '@/server/utils/db';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { sys_roles } from '@/types/server/security/sys_roles';

export default defineEventHandler( async (event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    const id = getRouterParam(event, 'id');
    const userSessionId = event.context.user.id;
    const body = await readBody(event);
    const payload = await sys_roles.cast(body);
    sys_roles.validate(body, { strict: false, abortEarly: false });
    await hasUserPermission(userSessionId, PermissionsList.ROLES_EDIT);

    //Database actions
    await serverDB.query('BEGIN');

    //Update specific profile data
    const sqlUpdateUserData = `update sys_profiles set
       name_es = COALESCE('${payload.name_es}', name_es)
      ,is_active = COALESCE(${payload.is_active ?? false}, is_active)
      ,updated_at = now()
      ,updated_by = '${userSessionId}'
      WHERE id = '${id}'`;
    await serverDB.query(sqlUpdateUserData);

    //Update Companies
    const sqlLinksDelete = `delete from sys_profiles_links WHERE sys_profile_id = '${id}'`;
    await serverDB.query(sqlLinksDelete);

    let sqlLinksInsert = 'insert into sys_profiles_links (sys_profile_id, sys_link_id) values';
    payload.sys_profiles_links?.forEach((linkId) => {
      sqlLinksInsert += `('${id}', '${linkId.sys_link_id}'),`;
    });
    sqlLinksInsert = sqlLinksInsert.substring(0, sqlLinksInsert.length - 1);//remove last comma
    await serverDB.query(sqlLinksInsert);
    
    await serverDB.query('COMMIT');
    return { id: id };
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    await serverDB.query('ROLLBACK');
    throw createError({ statusCode: 500, statusMessage: String(err) ?? 'Unhandled exception' });
  }
});