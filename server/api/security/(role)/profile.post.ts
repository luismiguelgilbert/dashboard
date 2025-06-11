// import { hasPermission, useSanitizeParams } from '@@/server/utils/handler';

export default defineEventHandler(async (event) => {
  try {
    // await hasPermission(event, PermissionsList.USERS_READ);
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
