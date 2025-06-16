export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'User not found' });
    }
    const serverDB = useDatabase();
    const query = await serverDB.sql`
      select
      id,
      parent,
      name_es,
      icon
      from sys_links
      order by id
    `;

    return lookup_sys_links_schema.array().parse(query.rows);
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
