export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);
  const serverDB = useDatabase();
  try {
    const { data: payload, error } = await readValidatedBody(event, bitacora_rides_schema.safeParse);
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
    if (payload.is_new) {
      hasPermissions(event, [PermissionsList.BITACORA_RIDES_CREATE])
    } else {
      hasPermissions(event, [PermissionsList.BITACORA_RIDES_EDIT]);
    }

    await serverDB.exec('BEGIN');
    // NOTE: [car_id] will be in [payload.id]
    // NOTE: when [payload.is_new] then => Insert records || else, update all open records for the company/place/car
    if (payload.is_new) {
      await serverDB.sql`insert into bita_rides
        (sys_company_id, place_id, car_id, reason_id, driver, is_complete, is_active, ride_start, ride_start_km, ride_start_comment
        , ride_end, ride_end_km, ride_end_comment, updated_by)
        values (
          ${companyId},
          ${placeId},
          ${payload.id},
          ${payload.reason_id},
          ${payload.driver},
          ${payload.is_complete},
          ${payload.is_active},
          ${payload.ride_start},
          ${payload.ride_start_km},
          ${payload.ride_start_comment},
          ${payload.ride_end},
          ${payload.ride_end_km},
          ${payload.ride_end_comment},
          ${user?.userId}
        )
      `;
    } else {
      await serverDB.sql`update bita_rides
        set is_complete = ${payload.is_complete}
        , is_active = ${payload.is_active}
        , ride_end = ${payload.ride_end}
        , ride_end_km = ${payload.ride_end_km}
        , ride_end_comment = ${payload.ride_end_comment}
        , updated_by = ${user?.userId}
        , updated_at = now()
        where sys_company_id = ${companyId}
        and place_id = ${placeId}
        and car_id = ${payload.id}
        and is_complete = false
      `;
    }

    await serverDB.exec('COMMIT');
    return new Response('Record saved', { status: 200 });
  } catch (err) {
    console.error(`Error at ${event.method} ${event.path}.`, err);
    await serverDB.exec('ROLLBACK');
    throw createError({
      statusCode: 500,
      statusMessage: typeof err === 'object' && err !== null && 'message' in err
        ? (err as { message?: string }).message ?? `Unhandled exception`
        : `Unhandled exception`,
    });
  }
});
