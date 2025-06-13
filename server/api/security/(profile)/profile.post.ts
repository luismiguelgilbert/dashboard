export default defineEventHandler(async (event) => {
  try {
    await hasPermissions(event, [PermissionsList.ROLES_READ]);
    // event.context.params = useSanitizeParams(event.context.params);
    const { data: payload, error } = await readValidatedBody(event, get_record_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }

    const serverDB = useDatabase();
    const recordDataQuery = await serverDB.sql`
      SELECT
      a.id
      ,initcap(a.name_es) as name_es
      ,a.is_active
      ,array(
        select
        t.sys_link_id
        from sys_profiles_links t
        where t.sys_profile_id = a.id
      ) as sys_profiles_links
      ,to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      ,to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      from sys_profiles a
      WHERE a.id = ${payload.id}
    `;

    return (recordDataQuery.rows && recordDataQuery.rows[0])
      ? sys_profiles_schema.parse(recordDataQuery.rows[0])
      : sys_profiles_schema.parse({ id: payload.id, is_new: true })
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
