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
      1 as row_num,
      a.id,
      initcap(a.user_name) as user_name,
      initcap(a.user_lastname) as user_lastname,
      COALESCE(a.user_sex, False) as user_sex,
      a.avatar_url,
      a.is_active,
      a.email,
      a.sys_profile_id,
      d.name_es as sys_profile_name,
      a.dark_enabled
      from sys_users a
      left join sys_profiles d on a.sys_profile_id = d.id
      WHERE a.id = '${payload.id}'
    `);

    const userCompaniesQuery = await serverDB.prepare(`
      select
      (row_number() OVER ()) - 1 AS row_num,
      b.*
      from sys_companies_users a
      inner join sys_companies b on a.sys_company_id = b.id
      WHERE a.user_id = '${payload.id}'
    `);

    const userDefaultCompanyQuery = await serverDB.prepare(`
      select a.sys_company_id
      from sys_companies_users a
      WHERE a.user_id = '${payload.id}' and a.is_default = True
    `);

    const results = await Promise.all([
      userDataQuery.get(),
      userCompaniesQuery.all(),
      userDefaultCompanyQuery.all(),
    ]);

    return sys_users_schema.parse({
      ...sys_users_schema.parse(results[0] ?? {}),
      sys_companies_users: results[1],
      // default_user_company: results[2][0]?.sys_company_id ?? undefined,
      default_user_company: undefined,
    });
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
