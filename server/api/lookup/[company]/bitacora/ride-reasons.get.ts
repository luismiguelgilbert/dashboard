export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event);
    const companyId = get_company_schema.parse(event.context.params?.company);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'User not found' });
    }
    if (!companyId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid request: a company ID is required.',
      });
    }
    await hasCompanies(event, [companyId]);

    const serverDB = useDatabase();
    const query = await serverDB.sql`
      select
      id
      ,initcap(name_es) as name_es
      ,is_active
      ,NOT(is_active) as disabled
      from bita_rides_reasons
      where sys_company_id = ${companyId}
      order by lower(name_es)
    `;

    return lookup_bitacora_reasons_schema.array().parse(query.rows);
  } catch (err) {
    console.error(`Error at ${event.method} ${event.path}.`, err);
    throw createError({
      statusCode: 500,
      statusMessage: typeof err === 'object' && err !== null && 'message' in err
        ? (err as { message?: string }).message ?? `Unhandled exception`
        : `Unhandled exception`,
    });
  }
});
