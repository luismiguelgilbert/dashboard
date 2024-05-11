import serverDB from '@/server/utils/db';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';

import { companyBody } from '@/types/server/sys_companies';

export default defineEventHandler( async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const userSessionId = event.context.user.id;
    const payload = await readValidatedBody(event, body => companyBody.cast(body));
    await hasUserPermission(userSessionId, PermissionsList.COMPANIES_EDIT);

    //Data sanitization
    const company_number = payload.companyData.company_number ? `'${payload.companyData.company_number}'` : null;
    const name_es = payload.companyData.name_es ? `'${payload.companyData.name_es}'` : null;
    const name_es_short = payload.companyData.name_es_short ? `'${payload.companyData.name_es_short}'` : null;
    const is_active = payload.companyData.is_active;
    const billing_phone = payload.companyData.billing_phone ? `'${payload.companyData.billing_phone}'` : null;
    const billing_address = payload.companyData.billing_address ? `'${payload.companyData.billing_address}'` : null;

    //Database actions
    await serverDB.query('BEGIN');

    //Update specific profile data
    const sqlUpdateUserData = `update sys_companies set
       company_number = COALESCE(${company_number}, company_number)
      ,name_es = COALESCE(${name_es}, name_es)
      ,name_es_short = COALESCE(${name_es_short}, name_es_short)
      ,is_active = COALESCE(${is_active}, is_active)
      ,billing_phone = COALESCE(${billing_phone}, billing_phone)
      ,billing_address = COALESCE(${billing_address}, billing_address)
      ,updated_at = now()
      ,updated_by = '${userSessionId}'
      WHERE id = '${id}'`;
    await serverDB.query(sqlUpdateUserData);
    
    await serverDB.query('COMMIT');
    return { id: id };
  } catch(err) {
    await serverDB.query('ROLLBACK');
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: err.statusCode ?? 500,
      statusMessage: `${err ?? 'Unhandled exception'}`,
    });
  }
});