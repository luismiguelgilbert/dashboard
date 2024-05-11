import { array } from 'yup';
import serverDB from '@/server/utils/db';
import { userData, userCompanies, userMenuData } from '@/types/server/sys_users';

export default defineEventHandler( async (event) => {
  try{
    const id = (event.context.user.id);

    //Get User Data
    const sqlUserSessionDataRows = `WITH user_company AS (
        select
        int1.id as user_id
        ,int3.id as sys_company_id
        ,int2.is_default
        from sys_users int1
        inner join sys_companies_users int2 on int2.user_id = int1.id
        inner join sys_companies int3 on int3.id = int2.sys_company_id
        WHERE int1.id = '${id}'
        order by int2.is_default desc, int3.name_es_short
        limit 1
      )
      SELECT
      a.id,
      INITCAP(b.user_name) as user_name,
      INITCAP(b.user_lastname) as user_lastname,
      b.user_sex,
      b.avatar_url,
      b.website,
      a.email,
      c.sys_profile_id,
      INITCAP(d.name_es) as sys_profile_name,
      b.dark_enabled,
      b.default_color,
      b.default_dark_color,
      e.sys_company_id as prefered_company_id,
      to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at,
      to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at,
      to_char (a.last_sign_in_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as last_sign_in_at
      from auth.users a
      left join sys_users b on a.id = b.id
      left join sys_profiles_users c on c.user_id = a.id
      left join sys_profiles d on c.sys_profile_id = d.id
      left join user_company e on e.user_id = a.id
      WHERE a.id = '${id}'`;
    const userSessionDataResultset = await serverDB.query(sqlUserSessionDataRows);
    const userSessionDataRows = array(userData).cast(userSessionDataResultset.rows);

    if (!(userSessionDataRows?.length === 1 && userSessionDataRows[0].id === id)) {
      throw createError({ statusCode: 500, message: 'Usuario no encontrado', });
    }

    //Get User Companies
    const sqlUserCompaniesRows = `select 
      b.id,
      INITCAP(b.name_es) as name_es,
      INITCAP(b.name_es_short) as name_es_short,
      b.is_active,
      b.avatar_url,
      a.is_default
      from sys_companies_users a
      inner join sys_companies b on a.sys_company_id = b.id
      where a.user_id = '${id}'
      order by b.name_es_short`;
    const userCompaniesResultset = await serverDB.query(sqlUserCompaniesRows);
    const userCompaniesRows = array(userCompanies).cast(userCompaniesResultset.rows);
    if (!(userCompaniesRows && userCompaniesRows.length > 0 && userCompaniesRows?.some(company => company.is_active))) {
      throw createError({ statusCode: 500, message: 'Usuario no tiene una organización activa', });
    }

    //Get User MenuData
    const sqlUserMenu = `select
      d.id,
      d.parent,
      d.position as position_num,
      d.link,
      d.name_es,
      d.icon,
      d.comment_es,
      d.requires_company
      from sys_profiles_users a
      inner join sys_profiles b on a.sys_profile_id = b.id
      inner join sys_profiles_links c on c.sys_profile_id = b.id
      inner join sys_links d on c.sys_link_id = d.id
      where a.user_id = '${id}'
      UNION
        SELECT
        r.id,
        r.parent,
        r.position as position_num,
        r.link,
        r.name_es,
        r.icon,
        r.comment_es,
        r.requires_company
        from sys_links r
        where r.id in (
          select d.parent
          from sys_profiles_users a
          inner join sys_profiles b on a.sys_profile_id = b.id
          inner join sys_profiles_links c on c.sys_profile_id = b.id
          inner join sys_links d on c.sys_link_id = d.id
          where a.user_id = '${id}'
        )
      order by 3`;
    const userMenuResultset = await serverDB.query(sqlUserMenu);
    const userMenuRows = array(userMenuData).cast(userMenuResultset.rows);

    return {
      userData: userSessionDataRows[0],
      userCompanies: userCompaniesRows,
      userMenu: userMenuRows,
    };
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});
