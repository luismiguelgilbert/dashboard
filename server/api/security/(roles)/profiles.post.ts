// import { hasPermission } from '@@/server/utils/handler';

export default defineEventHandler(async (event) => {
  try {
    // await hasPermission(event, PermissionsList.USERS_READ);
    const { data: payload, error } = await readValidatedBody(event, sys_profiles_query_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }

    // QUERIES
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
      ${payload.searchString?.length > 0
          ? `and (
            a.name_es ilike '%${payload.searchString}%'
          )`
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
