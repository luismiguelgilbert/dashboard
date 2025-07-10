export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event);
    const companyId = get_company_schema.parse(event.context.params?.company);
    const placeId = get_company_schema.parse(event.context.params?.placeId);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'User not found' });
    }
    if (!companyId || !placeId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid request: a company ID and a place ID is required.',
      });
    }
    await hasCompanies(event, [companyId]);

    const serverDB = useDatabase();
    const query = await serverDB.sql`
      select distinct
      visitor_name,
      visitor_number,
      visitor_company
      from bita_visits
      where sys_company_id = ${companyId}
      and place_id = ${placeId}
      and is_active = True
      order by visitor_name
    `;

    return lookup_bitacora_visitors_schema.array().parse(query.rows);
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
