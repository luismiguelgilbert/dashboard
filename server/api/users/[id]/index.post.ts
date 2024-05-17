import serverDB from '@/server/utils/db';
import { serverSupabaseServiceRole } from '#supabase/server';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { userPayload } from '@/types/server/sys_users';

export default defineEventHandler( async (event) => {
  try {
    // event.context.params = useSanitizeParams(event.context.params);
    const userSessionId = event.context.user.id;
    const body = await readBody(event);
    await userPayload.validate(body, { strict: true, abortEarly: false });
    const payload = await userPayload.cast(body);
    await hasUserPermission(userSessionId, PermissionsList.USERS_CREATE);

    //Create User on Supabase
    const supabaseService = await serverSupabaseServiceRole(event);
    const { data, error } = await supabaseService.auth.signUp({
      email: payload.userData.email,
      password: process.env.NEWUSERSDEFAULTPWD!,
      options: {
        data: {
          user_name: payload.userData.user_name,
          user_lastname: payload.userData.user_lastname,
          avatar_url: ''
        }
      }
    });
    if (error) {
      console.error({error});
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
    const id = data.user?.id;

    //Database actions
    await serverDB.query('BEGIN');

    //Insert user data
    const sqlInsertUserData = `insert into public.sys_users (id, user_name, user_lastname, avatar_url, updated_by)
      values ('${id}', '${payload.userData.user_name}', '${payload.userData.user_lastname}', '', '${id}');`;
    console.log('sqlInsertUserData');
    console.log(sqlInsertUserData);
    await serverDB.query(sqlInsertUserData);

    //Update user data
    const sqlUpdateUserData = `update sys_users set
       user_name = COALESCE('${payload.userData.user_name}', user_name)
      ,user_lastname = COALESCE('${payload.userData.user_lastname}', user_lastname)
      ,user_sex = COALESCE(${payload.userData.user_sex ?? false}, user_sex)
      ,dark_enabled = COALESCE(${payload.userData.dark_enabled ?? false}, dark_enabled)
      ,default_color = COALESCE('${payload.userData.default_color ?? 'indigo'}', default_color)
      ,default_dark_color = COALESCE('${payload.userData.default_dark_color ?? 'zinc'}', default_dark_color)
      ,updated_at = now()
      ,updated_by = '${userSessionId}'
      WHERE id = '${id}'`;
    console.log('sqlUpdateUserData');
    console.log(sqlUpdateUserData);
    await serverDB.query(sqlUpdateUserData);

    //Update Profiles
    const sqlProfilesDelete = `delete from sys_profiles_users WHERE user_id = '${id}'`;
    await serverDB.query(sqlProfilesDelete);
    
    const sqlProfileInsert = `insert into sys_profiles_users (sys_profile_id, user_id)
      values (${payload.userData.sys_profile_id}, '${id}')`;
    await serverDB.query(sqlProfileInsert);

    //Update Companies
    const sqlSysCompaniesDelete = `delete from sys_companies_users WHERE user_id = '${id}'`;
    await serverDB.query(sqlSysCompaniesDelete);

    let sqlCompaniesInsert = 'insert into sys_companies_users (sys_company_id, user_id) values ';
    payload.userCompanies?.forEach((company) => {
      sqlCompaniesInsert += `('${company}', '${id}') `;
    });
    sqlCompaniesInsert = sqlCompaniesInsert.replaceAll(') (', ') , (');
    await serverDB.query(sqlCompaniesInsert);

    if (payload.userData.prefered_company_id) {
      const sqlUpdateDefaultCompany = `update sys_companies_users 
        set is_default = true 
        where user_id = '${id}'
        and sys_company_id = '${payload.userData.prefered_company_id}'`;
      await serverDB.query(sqlUpdateDefaultCompany);
    }
    
    await serverDB.query('COMMIT');
    return { id: id };
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    await serverDB.query('ROLLBACK');
    throw createError({ statusCode: 500, statusMessage: String(err) ?? 'Unhandled exception' });
  }
});