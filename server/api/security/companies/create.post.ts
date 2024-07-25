import serverDB from '@/server/utils/db';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { sys_companies } from '@/types/server/security/sys_companies';

export default defineEventHandler( async (event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    const userSessionId = event.context.user.id;
    const body = await readBody(event);
    const payload = await sys_companies.cast(body);
    sys_companies.validate(body, { strict: false, abortEarly: false });
    await hasUserPermission(userSessionId, PermissionsList.COMPANIES_CREATE);

    //Database actions
    await serverDB.query('BEGIN');

    //Create record
    const sqlUpdateUserData = `insert into sys_companies
      (company_number, name_es, name_es_short, billing_phone, billing_address, is_active, updated_by)
      values (
        '${payload.company_number}',
        '${payload.name_es}',
        '${payload.name_es_short}',
        '${payload.billing_phone}',
        '${payload.billing_address}',
        ${payload.is_active ?? false},
        '${userSessionId}'
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