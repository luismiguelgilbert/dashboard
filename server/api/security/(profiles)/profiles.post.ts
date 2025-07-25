export default defineEventHandler(async (event) => {
  try {
    await hasPermissions(event, [PermissionsList.ROLES_READ]);
    const { data: payload, error } = await readValidatedBody(event, sys_profiles_query_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }

    // QUERIES
    const pageSize = 25;
    const sort = sys_profiles_sort_enum_server.find(s => s.id === payload.sort) || sys_profiles_sort_enum_server['1'];
    const serverDB = useDatabase();
    // ,to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
    const userDataQuery = await serverDB.prepare(`
      with users_count as (
        select sys_profile_id, count(*) as profile_users_count
        from sys_users int1
        group by int1.sys_profile_id
      )

      select
       a.id
      ,initcap(a.name_es) as name_es
      ,a.is_active
      ,profile_users_count
      from sys_profiles a
      left join users_count on a.id = users_count.sys_profile_id
      where (1 = 1)
      ${payload.search && payload.search.trim()?.length > 0
          ? `and (
            a.name_es ilike '%${payload.search}%'
          )`
          : ''
      }
      ${payload.is_active && payload.is_active.length > 0
          ? `and (a.is_active in (${payload.is_active.join(',')}))`
          : ''
      }
      ORDER BY ${sort?.label} ${payload.order}
      OFFSET ${(pageSize) * ((payload.page ?? 1) - 1)} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY
    `);

    return sys_profiles_schema.array().parse(await userDataQuery.all());
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
