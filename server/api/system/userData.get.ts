import serverDB from '@/server/utils/db'
import { sys_users } from '@/types/server/sys_users'
import { sys_companies } from '@/types/server/sys_companies'

export default defineEventHandler( async (event) => {
  try{
    const sqlUserData = `select
      a.id,
      b.user_name,
      b.user_lastname,
      b.avatar_url,
      b.website,
      a.email,
      c.sys_profile_id,
      d.name_es as sys_profile_name,
      b.dark_enabled,
      b.default_color,
      b.default_dark_color,
      to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at,
      to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at,
      to_char (a.last_sign_in_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as last_sign_in_at,
      count(*) OVER() AS row_count
      from auth.users a
      left join sys_users b on a.id = b.id
      left join sys_profiles_users c on c.user_id = a.id
      left join sys_profiles d on c.sys_profile_id = d.id
      WHERE a.id = $1`
    const values = [event.context.user.id]
    const sys_user_promise = await serverDB.query(sqlUserData, values)

    const sqlUserCompanies = `select 
      b.id,
      b.company_number,
      b.name_es,
      b.name_es_short,
      b.billing_phone,
      b.billing_address,
      b.is_active,
      b.created_at,
      b.updated_at
      from sys_companies_users a
      inner join sys_companies b on a.sys_company_id = b.id
      where a.user_id = $1
      order by b.name_es_short`
    const companies_promise = await serverDB.query(sqlUserCompanies, values)

    //takes the user's default company, or the first one if there is no default
    const sqlUserCompany = `select 
      b.id,
      b.company_number,
      b.name_es,
      b.name_es_short,
      b.billing_phone,
      b.billing_address,
      b.is_active,
      b.created_at,
      b.updated_at
      from sys_companies_users a
      inner join sys_companies b on a.sys_company_id = b.id
      where a.user_id = $1
      order by a.is_default desc, b.name_es_short
      limit 1`
    const company_promise = await serverDB.query(sqlUserCompany, values)

    return {
      userData: sys_users.parse(sys_user_promise.rows[0]),
      userCompanies: sys_companies.array().parse(companies_promise.rows),
      userCompany: sys_companies.parse(company_promise.rows[0]),
    }
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`)
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    })
  }
})
