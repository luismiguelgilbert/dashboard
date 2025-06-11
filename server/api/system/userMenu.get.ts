export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event);

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'User not found' });
    }
    const serverDB = useDatabase();

    const query = await serverDB.sql`
      with user_links_level_2 as (
        select c.id, c.parent
        from sys_users a
        inner join sys_profiles_links b on a.sys_profile_id = b.sys_profile_id
        inner join sys_links c on b.sys_link_id = c.id
        inner join sys_profiles d on a.sys_profile_id = d.id
        where a.id = ${user.userId}
        and a.is_active = True
        and d.is_active = True
        and c.row_level = 2
      ),
        user_links_level_1 as (
        select distinct sys_links.id, sys_links.parent
        from user_links_level_2
        inner join sys_links on user_links_level_2.parent = sys_links.id 
      ),
        user_links_level_0 as (
        select distinct sys_links.id, sys_links.parent
        from user_links_level_1
        inner join sys_links on user_links_level_1.parent = sys_links.id 
      )
      select Y.*
      from (
        select * from user_links_level_0
        union select * from user_links_level_1
        union select * from user_links_level_2
      )X inner join sys_links Y on X.id = Y.id
      order by case when Y.parent is null then 1 else 2 end, Y.id, Y.position, Y.parent
    `;

    return sys_links_schema.array().parse(query.rows);
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
