export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event);
    await hasPermissions(event, [PermissionsList.BITACORA_RIDES_READ]);
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
    const recordDataQuery = await serverDB.prepare(`
      WITH incompleteRides AS (
        select
         i.car_id
        ,i.reason_id
        ,ii.name_es as reason_name
        ,i.driver
        ,i.ride_start
        from bita_rides i
        inner join bita_rides_reasons ii on i.sys_company_id = ii.sys_company_id and i.reason_id = ii.id
        where i.sys_company_id = '${companyId}'
        and i.place_id = '${placeId}'
        and i.car_id = '${payload.id}'
        and i.is_active = True
        and i.is_complete = False
      )
      SELECT
       a.id
      ,initcap(a.name_es) as name_es
      ,initcap(a.name_es_short) as name_es_short
      ,a.is_active
      ,a.avatar_url
      ,b.reason_id
      ,b.reason_name
      ,b.driver
      ,to_char (coalesce(b.ride_start, now())::timestamp at time zone 'UTC', 'YYYY-MM-DD" "HH24:MI:00+00') as ride_start
      from bita_cars a
      inner join bita_places_cars aa ON a.id = aa.car_id
      inner join bita_places aaa ON aa.place_id = aaa.id
      left join incompleteRides b ON a.id = b.car_id
      where a.sys_company_id = '${companyId}'
      and a.is_active = True
      and a.id = '${payload.id}'
      and aaa.id = '${placeId}'
    `);
    const result = await recordDataQuery.all();
    
    return (result[0]
      ? bitacora_rides_schema.parse(result[0])
      : bitacora_rides_schema.parse({
        id: payload.id,
        is_new: true,
        driver: null,
        reason_id: null,
        ride_end: null,
        ride_start_km: null,
        ride_end_km: null,
        responsible: `${user?.user_name} ${user?.user_lastname}` })
      );
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
