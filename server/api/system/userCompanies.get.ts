import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event);
    const companiesCookie = getCookie(event, 'nuxt-session-companies');
    if (!user || !companiesCookie) {
      throw createError({ statusCode: 401, statusMessage: 'User not found' });
    }
    const { userCompanies } = session_companies_schema.parse(jwt.verify(companiesCookie, process.env.NUXT_SESSION_PASSWORD!));

    
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

    const queryResult = sys_companies_schema.array().parse(query.rows);
    let allowedCompanies : sys_companies[] = [];
    if (query.rows) {
      queryResult?.forEach((row : sys_companies) => {
        if (userCompanies.includes(row.id)) {
          allowedCompanies.push(row);
        }
      });
    }

    return sys_companies_schema.array().parse(allowedCompanies);
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
