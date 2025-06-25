export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'User not found' });
    }
    const { data: payload, error } = await readValidatedBody(event, sys_companies_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    await hasCompanies(event, [payload.id]);

    // Update all user companies to not default
    const serverDB = useDatabase();
    await serverDB.sql`
      update sys_companies_users set is_default = False
      where user_id = ${user.userId}
    `;

    await serverDB.sql`
      update sys_companies_users set is_default = True
      where user_id = ${user.userId}
      and sys_company_id = ${payload.id}
    `;
  } catch (err) {
    console.error(`Error at ${event.method} ${event.path}.`, err);
    throw createError({
      statusCode: 500,
      statusMessage: typeof err === 'object' && err !== null && 'message' in err
        ? (err as { message?: string }).message ?? `Unhandled exception getting companies`
        : `Unhandled exception getting companies`,
    });
  }
});
