import serverDB from '@/server/utils/db';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import type { NuxtError } from '#app';

import { companyBody } from "@/types/server/sys_companies";

export default defineEventHandler( async (event) => {
  try {
    const userSessionId = event.context.user.id;
    const payload = await readValidatedBody(event, body => companyBody.parse(body))
    await hasUserPermission(userSessionId, PermissionsList.COMPANIES_CREATE);

    //Data sanitization
    const company_number = payload.companyData.company_number ? `'${payload.companyData.company_number}'` : null;
    const name_es = payload.companyData.name_es ? `'${payload.companyData.name_es}'` : null;
    const name_es_short = payload.companyData.name_es_short ? `'${payload.companyData.name_es_short}'` : null;
    const is_active = payload.companyData.is_active;
    const billing_phone = payload.companyData.billing_phone ? `'${payload.companyData.billing_phone}'` : null;
    const billing_address = payload.companyData.billing_address ? `'${payload.companyData.billing_address}'` : null;

    //Database actions
    await serverDB.query('BEGIN');

    //Insert company data
    const sqlInsertData = `insert into public.sys_companies (company_number, name_es, name_es_short, billing_phone, billing_address, is_active, updated_by)
      values (${company_number}, ${name_es}, ${name_es_short}, ${billing_phone}, ${billing_address}, ${is_active}, '${userSessionId}' )
      RETURNING id;`;
    const { rows } = await serverDB.query(sqlInsertData);
    const id = rows[0].id;
    
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