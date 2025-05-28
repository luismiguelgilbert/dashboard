// import { hasPermission, useSanitizeParams } from '@@/server/utils/handler';

export default defineEventHandler(async (event) => {
  const serverDB = useDatabase();
  try {
    // event.context.params = useSanitizeParams(event.context.params);
    // const { user } = await getUserSession(event);
    // if (!user) {
    //   throw createError({ statusCode: 401, statusMessage: 'User not found' });
    // }
    const { data: payload, error } = await readValidatedBody(event, sys_companies_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    // payload.is_new
    //   ? await hasPermission(event, PermissionsList.COMPANIES_CREATE)
    //   : await hasPermission(event, PermissionsList.COMPANIES_EDIT);

    await serverDB.exec('BEGIN');

    // Upsert data
    await serverDB.sql`insert into sys_companies 
      (id, company_number, name_es, name_es_short, billing_phone, billing_address, is_active, updated_by)
      values (
        ${payload.id},
        ${payload.company_number},
        ${payload.name_es},
        ${payload.name_es_short},
        ${payload.billing_phone},
        ${payload.billing_address},
        ${payload.is_active},
        '24f718bb-bbc4-41e5-a399-8330d8be3f70'
      )
      ON CONFLICT(id) DO UPDATE SET
        company_number = ${payload.company_number},
        name_es = ${payload.name_es},
        name_es_short = ${payload.name_es_short},
        billing_phone = ${payload.billing_phone},
        billing_address = ${payload.billing_address},
        is_active = ${payload.is_active},
        updated_by = '24f718bb-bbc4-41e5-a399-8330d8be3f70'
    `;

    await serverDB.exec('COMMIT');

    return new Response('Record saved', { status: 200 });
  } catch (err) {
    console.error(`Error at ${event.method} ${event.path}.`, err);
    await serverDB.exec('ROLLBACK');
    throw createError({
      statusCode: 500,
      statusMessage: typeof err === 'object' && err !== null && 'message' in err
        ? (err as { message?: string }).message ?? `Unhandled exception`
        : `Unhandled exception`,
    });
  }
});
