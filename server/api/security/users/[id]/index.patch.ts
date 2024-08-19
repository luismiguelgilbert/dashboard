import serverDB from '@/server/utils/db';
import { updateAlgolia } from '@/lib/helpers';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { sys_users } from '@/types/server/security/sys_users';

export default defineEventHandler( async (event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    const id = getRouterParam(event, 'id');
    const userSessionId = event.context.user.id;
    const body = await readBody(event);
    const payload = await sys_users.cast(body);
    sys_users.validate(body, { strict: false, abortEarly: false });
    await hasUserPermission(userSessionId, PermissionsList.USERS_EDIT);

    //Database actions
    await serverDB.query('BEGIN');

    //Update specific profile data
    const sqlUpdateUserData = `update sys_users set
       user_name = COALESCE('${payload.user_name}', user_name)
      ,user_lastname = COALESCE('${payload.user_lastname}', user_lastname)
      ,website = COALESCE('${payload.email}', website)
      ,user_sex = COALESCE(${payload.user_sex ?? false}, user_sex)
      ,dark_enabled = COALESCE(${payload.dark_enabled ?? false}, dark_enabled)
      ,sys_profile_id = COALESCE(${payload.sys_profile_id}, sys_profile_id)
      ,default_color = COALESCE('${payload.default_color ?? 'indigo'}', default_color)
      ,default_dark_color = COALESCE('${payload.default_dark_color ?? 'zinc'}', default_dark_color)
      ,updated_at = now()
      ,updated_by = '${userSessionId}'
      WHERE id = '${id}'`;
    await serverDB.query(sqlUpdateUserData);

    //Update Companies
    const sqlCompaniesDelete = `delete from sys_companies_users WHERE user_id = '${id}'`;
    await serverDB.query(sqlCompaniesDelete);

    let sqlCompaniesInsert = 'insert into sys_companies_users (sys_company_id, user_id, is_default) values';
    payload.sys_companies_users?.forEach((company) => {
      sqlCompaniesInsert += `('${company.sys_company_id}', '${id}', ${company.is_default}),`;
    });
    sqlCompaniesInsert = sqlCompaniesInsert.substring(0, sqlCompaniesInsert.length - 1);//remove last comma
    await serverDB.query(sqlCompaniesInsert);
    
    await serverDB.query('COMMIT');

    // Update Algolia Index
    updateAlgolia('sys_users', { ...payload, objectID: payload.id });

    return { id: id };
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    await serverDB.query('ROLLBACK');
    throw createError({ statusCode: 500, statusMessage: String(err) ?? 'Unhandled exception' });
  }
});