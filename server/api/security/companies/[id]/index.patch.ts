import serverDB from '@/server/utils/db';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { sys_companies } from '@/types/server/security/sys_companies';

export default defineEventHandler( async (event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    const id = getRouterParam(event, 'id');
    const userSessionId = event.context.user.id;
    const body = await readBody(event);
    const payload = await sys_companies.cast(body);
    sys_companies.validate(body, { strict: false, abortEarly: false });
    await hasUserPermission(userSessionId, PermissionsList.USERS_EDIT);

    //Database actions
    await serverDB.query('BEGIN');

    const sqlUpdateCompanyData = `update sys_companies set
       company_number = COALESCE('${payload.company_number}', company_number)
      ,name_es = COALESCE('${payload.name_es}', name_es)
      ,name_es_short = COALESCE('${payload.name_es_short}', name_es_short)
      ,is_active = COALESCE(${payload.is_active ?? false}, is_active)
      ,billing_phone = COALESCE('${payload.billing_phone}', billing_phone)
      ,billing_address = COALESCE('${payload.billing_address}', billing_address)
      ,updated_at = now()
      ,updated_by = '${userSessionId}'
      WHERE id = '${id}'`;
    await serverDB.query(sqlUpdateCompanyData);
    
    await serverDB.query('COMMIT');
    return { id: id };
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    await serverDB.query('ROLLBACK');
    throw createError({ statusCode: 500, statusMessage: String(err) ?? 'Unhandled exception' });
  }
});