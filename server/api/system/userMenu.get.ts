export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event);

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'User not found' });
    }
    const serverDB = useDatabase();

    const query = await serverDB.sql`
      with user_links as (
        select c.id, c.parent
        from sys_users a
        inner join sys_profiles_links b on a.sys_profile_id = b.sys_profile_id
        inner join sys_links c on b.sys_link_id = c.id
        inner join sys_profiles d on a.sys_profile_id = d.id
        where a.id = ${user.userId}
        and a.is_active = True
        and d.is_active = True
      )

      select
      a.id,
      a.parent,
      a.position,
      a.link,
      a.name_es,
      a.icon,
      a.comment_es,
      a.requires_company,
      a.row_level
      from sys_links a
      inner join user_links on a.id = user_links.id
      where not (a.row_level = 1 and (select count(*) from user_links int1 where int1.parent = a.id) = 0)
      order by case when a.parent is null then 1 else 2 end, a.id, a.position, a.parent
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
