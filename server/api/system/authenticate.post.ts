// Since we encrypt and store session data in cookies, we're constrained by the 4096-byte cookie size limit.
// If the session data exceeds this limit, it will not be stored correctly.
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
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
      ,a.sys_profile_id
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

  // Create Cookie with allowed companies
  const userActiveCompanies = await serverDB.sql`
    select
    b.id
    from sys_companies_users a
    inner join sys_companies b on a.sys_company_id = b.id
    where a.user_id = ${userId}
    and b.is_active = True
  `;
  if (userActiveCompanies?.error || (userActiveCompanies.rows?.length && userActiveCompanies.rows.length <= 0)) {
    sendRedirect(event, '/auth/login?invalid_companies=true');
  }
  const companiesToken = jwt.sign(
    { userId: userId, userCompanies: userActiveCompanies.rows?.map(c => c.id) },
    process.env.NUXT_SESSION_PASSWORD as string,
    { expiresIn: '7d' }
  )
  setCookie(event, 'nuxt-session-companies', companiesToken, { maxAge: 60 * 60 * 24 * 28, });

  // Create Cookie with app permissions
  const userPermissions = await serverDB.sql`
    with user_links_level_2 as (
      select c.id, c.parent
      from sys_users a
      inner join sys_profiles_links b on a.sys_profile_id = b.sys_profile_id
      inner join sys_links c on b.sys_link_id = c.id
      inner join sys_profiles d on a.sys_profile_id = d.id
      where a.id = ${userId}
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
    select Y.id
    from (
        select * from user_links_level_0
        union select * from user_links_level_1
        union select * from user_links_level_2
    )X inner join sys_links Y on X.id = Y.id
    order by Y.id
  `;

  if (userPermissions?.error || (userPermissions.rows?.length && userPermissions.rows.length <= 0)) {
    sendRedirect(event, '/auth/login?invalid_permissions=true');
  }
  const permissionsToken = jwt.sign(
    { userId: userId, userPermissions: userPermissions.rows?.map(c => c.id) },
    process.env.NUXT_SESSION_PASSWORD as string,
    { expiresIn: '7d' }
  )
  setCookie(event, 'nuxt-session-permissions', permissionsToken, { maxAge: 60 * 60 * 24 * 28, });

  // Create Cookie with bitacora places
  const userBitaPlaces = await serverDB.sql`
    select
    place_id as id
    from bita_places_users
    where user_id = ${userId}
  `;
  const placesToken = jwt.sign(
    { userId: userId, userPlaces: userBitaPlaces.rows?.map(c => c.id) },
    process.env.NUXT_SESSION_PASSWORD as string,
    { expiresIn: '7d' }
  )
  setCookie(event, 'nuxt-session-bitaplaces', placesToken, { maxAge: 60 * 60 * 24 * 28, });

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
