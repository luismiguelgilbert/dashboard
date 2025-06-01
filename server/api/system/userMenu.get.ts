export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event);

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'User not found' });
    }
    const serverDB = useDatabase();
    const query = await serverDB.sql`
      select
      c.id,
      c.parent,
      c.position,
      c.link,
      c.name_es,
      c.icon,
      c.comment_es,
      c.requires_company,
      c.row_level
      from sys_users a
      inner join sys_profiles_links b on a.sys_profile_id = b.sys_profile_id
      inner join sys_links c on b.sys_link_id = c.id
      inner join sys_profiles d on a.sys_profile_id = d.id
      where a.id = ${user.userId}
      and a.is_active = True
      and d.is_active = True
      order by case when c.parent is null then 1 else 2 end, c.position, c.parent
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
