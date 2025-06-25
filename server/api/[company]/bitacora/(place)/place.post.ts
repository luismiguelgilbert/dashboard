export default defineEventHandler(async (event) => {
  try {
    await hasPermissions(event, [PermissionsList.BITACORA_PLACES_READ]);
    const { data: payload, error } = await readValidatedBody(event, get_record_schema.safeParse);
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

    const serverDB = useDatabase();
    const recordDataQuery = await serverDB.sql`
      SELECT
       a.id
      ,initcap(a.name_es) as name_es
      ,initcap(a.name_es_short) as name_es_short
      ,a.is_active
      ,a.avatar_url
      ,to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      ,to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      ,array(
        select t.car_id 
        from bita_places_cars t
        where t.sys_company_id = ${companyId} and t.place_id = a.id
      ) as bita_places_cars
      from bita_places a
      WHERE 
      a.sys_company_id = ${companyId}
      and a.id = ${payload.id}
    `;

    return (recordDataQuery.rows && recordDataQuery.rows[0])
      ? bitacora_places_schema.parse(recordDataQuery.rows[0])
      : bitacora_places_schema.parse({ id: payload.id, is_new: true })
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
