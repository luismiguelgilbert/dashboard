export default defineEventHandler(async (event) => {
  try {
    await hasPermissions(event, [PermissionsList.COMPANIES_READ]);
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
      ,initcap(a.name_es_short) as name_es_short
      ,a.company_number
      ,a.billing_phone
      ,a.billing_address
      ,a.is_active
      ,a.avatar_url
      ,to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      ,to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      from sys_companies a
      WHERE a.id = ${payload.id}
    `;

    return (recordDataQuery.rows && recordDataQuery.rows[0])
      ? sys_companies_schema.parse(recordDataQuery.rows[0])
      : sys_companies_schema.parse({ id: payload.id, is_new: true })
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
