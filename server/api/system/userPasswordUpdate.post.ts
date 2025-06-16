export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'User not found' });
    }
    const { data: payload, error } = await readValidatedBody(event, passwordSchema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }

    // Update user password
    const serverDB = useDatabase();
    await serverDB.sql`
      update sys_users set 
      user_hash = crypt(${payload.confirm}, gen_salt('md5'))
      where id = ${user.userId}
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
