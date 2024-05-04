import serverDB from '@/server/utils/db';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import type { NuxtError } from '#app';

import { profileBody } from "@/types/server/sys_profiles";

export default defineEventHandler( async (event) => {
  try {
    const userSessionId = event.context.user.id;
    const payload = await readValidatedBody(event, body => profileBody.cast(body))
    await hasUserPermission(userSessionId, PermissionsList.ROLES_CREATE);

    //Database actions
    await serverDB.query('BEGIN');

    const sqlSysProfiles = `INSERT INTO sys_profiles (created_at, name_es, is_active, updated_at, updated_by) 
    values (now(), '${payload.profileData.name_es}', ${payload.profileData.is_active}, now(), '${userSessionId}') 
    RETURNING id`;
    const { rows } = await serverDB.query(sqlSysProfiles);
    const id = rows[0].id;
    
    //Update Profiles
    const sqlProfilesDelete = `delete from sys_profiles_links WHERE sys_profile_id = '${id}'`;
    await serverDB.query(sqlProfilesDelete);

    let sqlLinksInsert = `insert into sys_profiles_links (sys_profile_id,	sys_link_id) values `;
    payload.profileLinks?.forEach((link) => {
      sqlLinksInsert += `('${id}', '${link}'),`;
    });
    sqlLinksInsert = sqlLinksInsert.replace(/\,$/, '');
    await serverDB.query(sqlLinksInsert);
    
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