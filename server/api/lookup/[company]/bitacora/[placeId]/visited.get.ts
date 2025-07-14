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
      initcap(visited_name) as visited_name,
      upper(visited_area) as visited_area
      from bita_visits
      where sys_company_id = ${companyId}
      and place_id = ${placeId}
      and is_active = True
      and visited_area is not null
      and visited_name is not null
      and length(visited_name) > 0
      order by visited_name
    `;

    return lookup_bitacora_visited_schema.array().parse(query.rows);
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
