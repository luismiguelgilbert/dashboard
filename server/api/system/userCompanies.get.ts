export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event);

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'User not found' });
    }
    const serverDB = useDatabase();
    const query = await serverDB.sql`
      select
      c.*
      from sys_users a
      inner join sys_companies_users b on a.id = b.user_id
      inner join sys_companies c on c.id = b.sys_company_id
      where a.id = ${user.userId}
      and a.is_active = True
      and c.is_active = True
      order by b.is_default desc, c.name_es_short
    `;

    return sys_companies_schema.array().parse(query.rows);
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
