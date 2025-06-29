export default defineEventHandler(async (event) => {
  try {
    await hasPermissions(event, [PermissionsList.BITACORA_EVENTS_READ]);
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
      SELECT
       a.id
      ,to_char (a.event_at::timestamp at time zone 'UTC', 'YYYY-MM-DD" "HH24:MI:00+00') as event_at
      ,a.comments
      ,a.is_active
      ,a.is_critical
      ,a.avatar_url
      ,b.user_name || ' ' || b.user_lastname as responsible
      from bita_events a
      inner join sys_users b on a.updated_by = b.id
      WHERE 
      a.sys_company_id = ${companyId}
      and a.place_id = ${placeId}
      and a.id = ${payload.id}
    `;

    return (recordDataQuery.rows && recordDataQuery.rows[0])
      ? bitacora_events_schema.parse(recordDataQuery.rows[0])
      : bitacora_events_schema.parse({ id: payload.id, is_new: true })
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
