// Since we encrypt and store session data in cookies, we're constrained by the 4096-byte cookie size limit.
// If the session data exceeds this limit, it will not be stored correctly.

export default defineEventHandler(async (event) => {
  // event.context.params = useSanitizeParams(event.context.params);
  const { data: payload } = await readValidatedBody(event, login_schema.safeParse);

  const serverDB = useDatabase();
  // Query User data (email and password, user is active, user profile is active)
  const userData = await serverDB.sql`
    select
       a.id
      ,a.email
      ,a.avatar_url
      ,a.user_name
      ,a.user_lastname
    from sys_users a
    inner join sys_profiles b on a.sys_profile_id = b.id
    where LOWER(a.email) = LOWER(${payload?.email})
    and a.user_hash = crypt(${payload?.password}, user_hash)
    and a.is_active = True
    and b.is_active = True
  `;
  const userId = userData.rows && userData.rows[0]?.id as string;
  if (userData?.error || !userId || (userData.rows?.length && userData.rows.length <= 0)) {
    sendRedirect(event, '/auth/login?invalid=true');
  }
  // // Query User Companies
  // const userCompanies = await serverDB.sql`
  //   select
  //   c.*
  //   from sys_users a
  //   inner join sys_companies_users b on a.id = b.user_id
  //   inner join sys_companies c on c.id = b.sys_company_id
  //   where a.id = ${userId}
  //   and c.is_active = True
  // `;
  // if (userCompanies?.error || (userCompanies.rows?.length && userCompanies.rows.length <= 0)) {
  //   sendRedirect(event, '/auth/login?invalid=true');
  // }

  await replaceUserSession(event, {
    user: {
      userId: userId,
      email: userData.rows && userData.rows[0]?.email,
      user_name: userData.rows && userData.rows[0]?.user_name,
      user_lastname: userData.rows && userData.rows[0]?.user_lastname,
      avatar_url: userData.rows && userData.rows[0]?.avatar_url,
      loggedInAt: new Date().toISOString(),
    }
  });

  sendRedirect(event, '/');
});
