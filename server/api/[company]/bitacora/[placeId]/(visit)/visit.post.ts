export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event);
    await hasPermissions(event, [PermissionsList.BITACORA_VISITS_READ]);
    const { data: payload, error } = await readValidatedBody(event, get_record_schema.safeParse);
    const companyId = get_company_schema.parse(event.context.params?.company);
    const placeId = get_company_schema.parse(event.context.params?.placeId);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    if (!companyId || !placeId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid request: a company ID and a place ID is required.',
      });
    }
    await hasCompanies(event, [companyId]);

    const serverDB = useDatabase();
    const recordDataQuery = await serverDB.sql`
      select
       a.id
      ,a.visitor_name
      ,a.visitor_number
      ,a.visitor_company
      ,to_char (lower(a.visit_date_range)::timestamp at time zone 'UTC', 'YYYY-MM-DD" "HH24:MI:00+00') as visit_start
      ,a.visited_name
      ,a.visited_area
      ,a.vehicle_name
      ,a.vehicle_plate
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
      where 
      a.sys_company_id = ${companyId}
      and a.place_id = ${placeId}
      and a.id = ${payload.id}
    `;

    return (recordDataQuery.rows && recordDataQuery.rows[0])
      ? bitacora_visits_schema.parse(recordDataQuery.rows[0])
      : bitacora_visits_schema.parse({ id: payload.id, is_new: true, responsible: `${user?.user_name} ${user?.user_lastname}` })
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
