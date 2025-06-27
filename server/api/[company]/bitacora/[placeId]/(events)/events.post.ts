export default defineEventHandler(async (event) => {
  try {
    await hasPermissions(event, [PermissionsList.BITACORA_EVENTS_READ]);
    const { data: payload, error } = await readValidatedBody(event, bitacora_events_query_schema.safeParse);
    const companyId = get_company_schema.parse(event.context.params?.company);
    const placeId = get_company_schema.parse(event.context.params?.placeId);
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
    const sort = bitacora_events_sort_enum_server.find(s => s.id === payload.sort) || bitacora_events_sort_enum_server['1'];
    const serverDB = useDatabase();
    // ,to_char (a.event_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as event_at
    const userDataQuery = await serverDB.prepare(`
      select
       a.id
      ,a.event_at::text as event_at
      ,a.comments
      ,a.is_active
      ,a.is_critical
      ,a.avatar_url
      ,b.user_name || ' ' || b.user_lastname as responsible
      from bita_events a
      inner join sys_users b on a.updated_by = b.id
      where (1 = 1)
      ${companyId ? `and (a.sys_company_id = '${companyId}')` : ''}
      ${placeId ? `and (a.place_id = '${placeId}')` : ''}
      ${payload.is_active && payload.is_active.length > 0
          ? `and (a.is_active in (${payload.is_active.join(',')}))`
          : ''
      }
      ${payload.is_critical && payload.is_critical.length > 0
          ? `and (a.is_critical in (${payload.is_critical.join(',')}))`
          : ''
      }
      ORDER BY ${sort?.label} ${payload.order}
      OFFSET ${(pageSize) * ((payload.page ?? 1) - 1)} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY
    `);

    return bitacora_events_schema.array().parse(await userDataQuery.all());
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
