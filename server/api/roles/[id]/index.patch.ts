import serverDB from '@/server/utils/db';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import type { NuxtError } from '#app';

import { profileBody } from "@/types/server/sys_profiles";

export default defineEventHandler( async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const userSessionId = event.context.user.id;
    const payload = await readValidatedBody(event, body => profileBody.cast(body))
    await hasUserPermission(userSessionId, PermissionsList.ROLES_EDIT);

    //Database actions
    await serverDB.query('BEGIN');

    //UserData sanitization
    const name_es = payload.profileData.name_es ? `'${payload.profileData.name_es}'` : null;
    const is_active = payload.profileData.is_active;

    //Update specific profile data
    const sqlUpdateUserData = `update sys_profiles set
       name_es = COALESCE(${name_es}, name_es)
      ,is_active = COALESCE(${is_active}, is_active)
      ,updated_at = now()
      ,updated_by = '${userSessionId}'
      WHERE id = '${id}'`;
    await serverDB.query(sqlUpdateUserData);

    //Delete all links for specific profile
    const sqlSysProfilesDelete = `delete from sys_profiles_links WHERE sys_profile_id = ${id}`;
    await serverDB.query(sqlSysProfilesDelete);

    //Add new links for specific profile
    let sqlSysProfilesInsert = `insert into sys_profiles_links (sys_profile_id, sys_link_id) values `;
    payload.profileLinks?.forEach((link) => {
      sqlSysProfilesInsert += `(${Number(id)}, '${link}'),`;
    });
    sqlSysProfilesInsert = sqlSysProfilesInsert.replace(/\,$/, '');
    await serverDB.query(sqlSysProfilesInsert);
    
    await serverDB.query('COMMIT');
    return { id: id };
  } catch(err: NuxtError | any) {
    await serverDB.query('ROLLBACK');
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: err.statusCode ?? 500,
      statusMessage: `${err ?? 'Unhandled exception'}`,
    });
  }
});