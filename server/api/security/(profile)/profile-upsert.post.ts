// import { hasPermission, useSanitizeParams } from '@@/server/utils/handler';

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);
  const serverDB = useDatabase();
  try {
    // event.context.params = useSanitizeParams(event.context.params);
    // const { user } = await getUserSession(event);
    // if (!user) {
    //   throw createError({ statusCode: 401, statusMessage: 'User not found' });
    // }
    const { data: payload, error } = await readValidatedBody(event, sys_profiles_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    // payload.is_new
    //   ? await hasPermission(event, PermissionsList.PROFILES_CREATE)
    //   : await hasPermission(event, PermissionsList.PROFILES_EDIT);

    await serverDB.exec('BEGIN');

    // Upsert data
    await serverDB.sql`insert into sys_profiles 
      (id, name_es, is_active, updated_by)
      values (
        ${payload.id},
        ${payload.name_es},
        ${payload.is_active},
        ${user?.userId}
      )
      ON CONFLICT(id) DO UPDATE SET
        name_es = ${payload.name_es},
        is_active = ${payload.is_active},
        updated_by = ${user?.userId}
    `;

    // Delete profile links and Insert new ones
    await serverDB.sql`delete from sys_profiles_links where sys_profile_id = ${payload.id}`;
    let multipleRowsInsert = 'insert into sys_profiles_links (sys_profile_id, sys_link_id) values ';
    payload.sys_profiles_links.forEach(async (link) => {
      multipleRowsInsert += `('${payload.id}', '${link}'),`;
    });
    multipleRowsInsert = multipleRowsInsert.slice(0, -1); // Remove the last comma
    await serverDB.exec(multipleRowsInsert);

    await serverDB.exec('COMMIT');
    return new Response('Record saved', { status: 200 });
  } catch (err) {
    console.error(`Error at ${event.method} ${event.path}.`, err);
    await serverDB.exec('ROLLBACK');
    throw createError({
      statusCode: 500,
      statusMessage: typeof err === 'object' && err !== null && 'message' in err
        ? (err as { message?: string }).message ?? `Unhandled exception`
        : `Unhandled exception`,
    });
  }
});
