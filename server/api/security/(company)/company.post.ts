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
    const userDataQuery = await serverDB.prepare(`
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
      WHERE a.id = '${payload.id}'
    `);

    return sys_companies_schema.parse(await userDataQuery.get() ?? {});
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
