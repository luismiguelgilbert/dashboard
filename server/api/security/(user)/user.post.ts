const serverDB = useDatabase();
export const recordQuery = (recordId: string) => serverDB.prepare(`
    SELECT
    a.id,
    initcap(a.user_name) as user_name,
    initcap(a.user_lastname) as user_lastname,
    COALESCE(a.user_sex, False) as user_sex,
    a.avatar_url,
    a.is_active,
    a.email,
    a.sys_profile_id,
    d.name_es as sys_profile_name,
    array(
      select t.sys_company_id 
      from sys_companies_users t
      where t.user_id = a.id
    ) as sys_companies_users
    from sys_users a
    left join sys_profiles d on a.sys_profile_id = d.id
    WHERE a.id = '${recordId}'`
);

export default defineEventHandler(async (event) => {
  try {
    hasPermissions(event, [PermissionsList.USERS_READ])
    const { data: payload, error } = await readValidatedBody(event, get_record_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    const recordData = await recordQuery(payload.id).all();

    return (recordData && recordData.length > 0)
      ? sys_users_schema.parse(recordData[0])
      : sys_users_schema.parse({ id: payload.id, sys_profile_id: 0, is_new: true })
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
