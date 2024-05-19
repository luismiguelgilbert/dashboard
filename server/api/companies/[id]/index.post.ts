import serverDB from '@/server/utils/db';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { companyPayload } from '@/types/server/sys_companies';

export default defineEventHandler( async (event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    const userSessionId = event.context.user.id;
    const payload = await readValidatedBody(event, body => companyPayload.cast(body));
    await hasUserPermission(userSessionId, PermissionsList.COMPANIES_CREATE);

    //Database actions
    await serverDB.query('BEGIN');

    //Insert company data
    const sqlInsertData = `insert into public.sys_companies
      (company_number, name_es, name_es_short, billing_phone, billing_address, is_active, updated_by)
      values (
        '${payload.companyData.company_number}',
        '${payload.companyData.name_es}',
        '${payload.companyData.name_es_short}',
        '${payload.companyData.billing_phone}',
        '${payload.companyData.billing_address}',
        '${payload.companyData.is_active ?? false}',
        '${userSessionId}'
      )
      RETURNING id;`;
    const { rows } = await serverDB.query(sqlInsertData);
    const id: string = rows[0].id;
    
    await serverDB.query('COMMIT');
    return { id: id };
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    await serverDB.query('ROLLBACK');
    throw createError({ statusCode: 500, statusMessage: String(err) ?? 'Unhandled exception' });
  }
});