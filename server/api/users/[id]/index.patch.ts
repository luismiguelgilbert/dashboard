import serverDB from '@/server/utils/db';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { userBody } from "@/types/server/sys_users";
import type { NuxtError } from '#app';

export default defineEventHandler( async (event) => {
  try{
    const id = getRouterParam(event, 'id')
    const userSessionId = event.context.user.id;
    const payload = await readValidatedBody(event, body => userBody.parse(body))
    await hasUserPermission(userSessionId, PermissionsList.USERS_EDIT);

    //UserData sanitization
    const user_name = payload.userData.user_name ? `'${payload.userData.user_name}'` : null;
    const user_lastname = payload.userData.user_lastname ? `'${payload.userData.user_lastname}'` : null;
    const user_sex = payload.userData.user_sex;
    const avatar_url = payload.userData.avatar_url ? `'${payload.userData.avatar_url}'` : null;
    const sys_profile_id = payload.userData.sys_profile_id ? `${payload.userData.sys_profile_id}` : null;
    const dark_enabled = payload.userData.dark_enabled;
    const default_color = payload.userData.default_color ? `'${payload.userData.default_color}'` : 'indigo';
    const default_dark_color = payload.userData.default_dark_color ? `'${payload.userData.default_dark_color}'` : 'zinc';

    //Process
    await serverDB.query('BEGIN');
    
    const sqlUpdateUserData = `update sys_users set
       user_name = COALESCE(${user_name}, user_name)
      ,user_lastname = COALESCE(${user_lastname}, user_lastname)
      ,user_sex = COALESCE(${user_sex}, user_sex)
      ,avatar_url = COALESCE(${avatar_url}, avatar_url)
      ,dark_enabled = COALESCE(${dark_enabled}, dark_enabled)
      ,default_color = COALESCE(${default_color}, default_color)
      ,default_dark_color = COALESCE(${default_dark_color}, default_dark_color)
      ,updated_at = now()
      ,updated_by = '${userSessionId}'
      WHERE id = '${id}'`;
    await serverDB.query(sqlUpdateUserData);

    //Update Profiles
    const sqlProfilesDelete = `delete from sys_profiles_users WHERE user_id = '${id}'`;
    await serverDB.query(sqlProfilesDelete);

    let sqlProfileInsert = `insert into sys_profiles_users (sys_profile_id, user_id) values (${sys_profile_id}, '${id}')`;
    await serverDB.query(sqlProfileInsert);
    
    //Update Companies
    const sqlSysCompaniesDelete = `delete from sys_companies_users WHERE user_id = '${id}'`;
    await serverDB.query(sqlSysCompaniesDelete);

    let sqlCompaniesInsert = `insert into sys_companies_users (sys_company_id, user_id) values `;
    payload.userCompanies.forEach((company) => {
      sqlCompaniesInsert += `('${company}', '${id}'),`;
    });
    sqlCompaniesInsert = sqlCompaniesInsert.replace(/\,$/, '');
    await serverDB.query(sqlCompaniesInsert);
    
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