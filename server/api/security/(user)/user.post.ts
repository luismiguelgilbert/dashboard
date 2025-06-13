export default defineEventHandler(async (event) => {
  try {
    hasPermissions(event, [PermissionsList.USERS_READ])
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
      a.dark_enabled,
      array(
        select t.sys_company_id 
        from sys_companies_users t
        where t.user_id = a.id
      ) as sys_companies_users
      from sys_users a
      left join sys_profiles d on a.sys_profile_id = d.id
      WHERE a.id = ${payload.id}
    `;

    // const userDefaultCompanyQuery = await serverDB.prepare(`
    //   select a.sys_company_id
    //   from sys_companies_users a
    //   WHERE a.user_id = '${payload.id}' and a.is_default = True
    // `);

    // const results = await Promise.all([
    //   userDataQuery.get(),
    //   userCompaniesQuery.all(),
    //   userDefaultCompanyQuery.all(),
    // ]);

    return (recordDataQuery.rows && recordDataQuery.rows[0])
      ? sys_users_schema.parse(recordDataQuery.rows[0])
      : sys_users_schema.parse({ id: payload.id, sys_profile_id: 0, is_new: true })
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
