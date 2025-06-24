export default defineEventHandler(async (event) => {
  try {
    await hasPermissions(event, [PermissionsList.BITACORA_CARS_READ]);
    const { data: payload, error } = await readValidatedBody(event, bitacora_cars_query_schema.safeParse);
    const companyId = get_company_schema.parse(event.context.params?.company);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    if (!companyId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid request: a company ID is required.',
      });
    }
    await hasCompanies(event, [companyId]);

    // QUERIES
    const pageSize = 25;
    const sort = sys_profiles_sort_enum_server.find(s => s.id === payload.sort) || bitacora_cars_sort_enum_server['1'];
    const serverDB = useDatabase();
    // ,to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
    const userDataQuery = await serverDB.prepare(`
      select
       a.id
      ,initcap(a.name_es) as name_es
      ,initcap(a.name_es_short) as name_es_short
      ,a.is_active
      ,a.avatar_url
      from bita_cars a
      where (1 = 1)
      ${companyId ? `and (a.sys_company_id = '${companyId}')` : ''}
      ${payload.search && payload.search.trim()?.length > 0
          ? `and (
            a.name_es ilike '%${payload.search}%'
            or a.name_es_short ilike '%${payload.search}%'
          )`
          : ''
      }
      ${payload.is_active && payload.is_active.length > 0
          ? `and (a.is_active in (${payload.is_active.join(',')}))`
          : ''
      }
      ORDER BY ${sort?.label} ${payload.order}
      OFFSET ${(pageSize) * ((payload.page ?? 1) - 1)} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY
    `);

    return bitacora_cars_schema.array().parse(await userDataQuery.all());
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
