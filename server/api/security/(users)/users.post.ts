export default defineEventHandler(async (event) => {
  try {
    await hasPermissions(event, [PermissionsList.USERS_READ]);
    const { data: payload, error } = await readValidatedBody(event, sys_users_query_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }

    // QUERIES
    const pageSize = 25;
    const sort = sys_users_sort_enum_server.find(s => s.id === payload.sort) || sys_users_sort_enum_server['1'];
    const serverDB = useDatabase();
    const userDataQuery = await serverDB.prepare(`
      select
       a.id
      ,initcap(a.user_name) as user_name
      ,initcap(a.user_lastname) as user_lastname
      ,a.is_active
      ,a.user_sex
      ,a.avatar_url
      ,a.email
      ,b.name_es as sys_profile_name
      from sys_users a
      inner join sys_profiles b on a.sys_profile_id = b.id
      where (1 = 1)
      ${payload.search && payload.search.trim()?.length > 0
          ? `and (
            a.user_name ilike '%${payload.search.trim()}%'
            or a.user_lastname ilike '%${payload.search.trim()}%'
            or a.email ilike '%${payload.search.trim()}%'
            or b.name_es ilike '%${payload.search.trim()}%'
          )`
          : ''
      }
      ${payload.is_active && payload.is_active.length > 0
          ? `and (a.is_active in (${payload.is_active.join(',')}))`
          : ''
      }
      ${payload.user_sex && payload.user_sex.length > 0
          ? `and (a.user_sex in (${payload.user_sex.join(',')}))`
          : ''
      }
      ORDER BY ${sort?.label} ${payload.order}
      OFFSET ${(pageSize) * ((payload.page ?? 1) - 1)} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY
    `);

    return sys_users_schema.array().parse(await userDataQuery.all());
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
