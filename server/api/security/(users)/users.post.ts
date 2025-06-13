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
    const serverDB = useDatabase();
    const userDataQuery = await serverDB.prepare(`
      select
       a.id
      ,initcap(a.user_name) as user_name
      ,initcap(a.user_lastname) as user_lastname
      ,a.is_active
      ,a.avatar_url
      ,a.email
      ,b.name_es as sys_profile_name
      from sys_users a
      inner join sys_profiles b on a.sys_profile_id = b.id
      where (1 = 1)
      ${payload.searchString?.length > 0
          ? `and (
            a.user_name ilike '%${payload.searchString}%'
            or a.user_lastname ilike '%${payload.searchString}%'
            or a.email ilike '%${payload.searchString}%'
            or b.name_es ilike '%${payload.searchString}%'
          )`
          : ''
      }
      ${payload.filterProfile?.length > 0
          ? `and (a.sys_profile_id in (${payload.filterProfile}))`
          : ''
      }
      ${payload.filterSex?.length > 0
          ? `and (a.user_sex in (${payload.filterSex}))`
          : ''
      }
      ${payload.filterIsActive?.length > 0
          ? `and (a.is_active in (${payload.filterIsActive}))`
          : ''
      }
      ORDER BY ${payload.sortBy}
      OFFSET ${(payload.pageSize ?? 5) * ((payload.page ?? 1) - 1)} ROWS
      FETCH NEXT ${payload.pageSize} ROWS ONLY
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
