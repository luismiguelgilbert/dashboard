export default defineEventHandler(async (event) => {
  try {
    await hasPermissions(event, [PermissionsList.BITACORA_VISITS_READ]);
    const { data: payload, error } = await readValidatedBody(event, bitacora_visits_query_schema.safeParse);
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
    const sort = bitacora_visits_sort_enum_server.find(s => s.id === payload.sort) || bitacora_visits_sort_enum_server['1'];
    const serverDB = useDatabase();
    
    // ,to_char (a.event_at::timestamp at time zone 'UTC', 'YYYY-MM-DD" "HH24:MI:00+00') as event_at
    const userDataQuery = await serverDB.prepare(`
      select
       a.id
      ,a.visitor_name
      ,a.visitor_number
      ,a.visitor_company
      ,a.visited_name
      ,a.visited_area
      ,a.reason_id
      ,c.name_es as reason_name
      ,a.vehicle_name
      ,a.vehicle_plate
      ,a.comments_in
      ,a.comments_out
      ,a.is_active
      ,a.is_complete
      ,a.avatar_url
      ,b.user_name || ' ' || b.user_lastname as responsible
      from bita_visits a
      inner join sys_users b on a.updated_by = b.id
      inner join bita_reasons c on a.sys_company_id = c.sys_company_id and a.reason_id = c.id
      where (1 = 1)
      ${companyId ? `and (a.sys_company_id = '${companyId}')` : ''}
      ${placeId ? `and (a.place_id = '${placeId}')` : ''}
      ${payload.is_active && payload.is_active.length > 0
          ? `and (a.is_active in (${payload.is_active.join(',')}))`
          : ''
      }
      ${payload.is_complete && payload.is_complete.length > 0
          ? `and (a.is_complete in (${payload.is_complete.join(',')}))`
          : ''
      }
      ORDER BY ${sort?.label} ${payload.order}
      OFFSET ${(pageSize) * ((payload.page ?? 1) - 1)} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY
    `);

    return bitacora_visits_schema.array().parse(await userDataQuery.all());
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
