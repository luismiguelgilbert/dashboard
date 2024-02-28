import serverDB from '@/server/utils/db'
import { sanitizeSQL } from '@/utils/utils'
import { filter_options, sort_options, sys_profiles, type type_sys_profiles } from '@/types/server/sys_profiles'

export default defineEventHandler( async (event) => {
  try{
    const filter = await readBody(event)
    const sortById = Number(filter.sortBy)
    const sortBy: string = sort_options.find(x => x.value === sortById)?.sqlValue ?? sort_options[0].sqlValue
    const page = Number(filter.page)
    const pageSize = Number(filter.pageSize)
    const offset = pageSize * (page - 1)
    const filterConditions: Array<string> = []
    filter_options.forEach(x => {
      if (filter.filterBy.includes(x.value)) {
        filterConditions.push(x.sqlValue)
      }
    })
    const filterBy = filterConditions.length ? ` AND (${filterConditions.join(' or ')})` : ''
    const search_string = sanitizeSQL(filter.searchString)
    const filterSearchString = search_string.length > 0
      ? ` and (a.name_es ILIKE '%${search_string}%' )` 
      : ''

    const text = `WITH users_by_profile AS (
        select
        int1.sys_profile_id
        , count(int1.user_id) as user_count
        from sys_profiles_users int1
        group by int1.sys_profile_id
      )
      SELECT
          a.id
        , a.name_es
        , a.is_active
        , to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
        , COALESCE(b.user_count,0) as user_count
        ,count(*) OVER() AS row_count
      FROM sys_profiles a
      LEFT JOIN users_by_profile b on a.id = b.sys_profile_id
      WHERE 1 = 1 
      ${filterBy}
      ${filterSearchString}
      ORDER BY ${sortBy}
      OFFSET ${offset}
      LIMIT ${pageSize}
    `
    const data = await serverDB.query(text)
    const result: type_sys_profiles[] = sys_profiles.array().parse(data.rows)
    
    return result
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`)
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    })
  }
})