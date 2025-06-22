import Excel from 'exceljs';

export default defineEventHandler(async (event) => {
  try {
    await hasPermissions(event, [PermissionsList.ROLES_EXPORT]);
    const { data: payload, error } = await readValidatedBody(event, sys_profiles_query_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }

    // QUERIES
    const sort = sys_profiles_sort_enum_server.find(s => s.id === payload.sort) || sys_profiles_sort_enum_server['1'];
    const serverDB = useDatabase();
    const userDataQuery = await serverDB.prepare(`
      with users_count as (
        select sys_profile_id, count(*) as profile_users_count
        from sys_users int1
        group by int1.sys_profile_id
      )

      select
       a.id
      ,initcap(a.name_es) as name_es
      ,a.is_active
      ,coalesce(profile_users_count,0) as profile_users_count
      from sys_profiles a
      left join users_count on a.id = users_count.sys_profile_id
      where (1 = 1)
      ${payload.search && payload.search.trim()?.length > 0
          ? `and (
            a.name_es ilike '%${payload.search}%'
          )`
          : ''
      }
      ${payload.is_active && payload.is_active.length > 0
          ? `and (a.is_active in (${payload.is_active.join(',')}))`
          : ''
      }
      ORDER BY ${sort?.label} ${payload.order}
    `);

    const data = await userDataQuery.all();

    const workbook = new Excel.Workbook();
    const worksheet = await workbook.addWorksheet('Perfiles');
    const fileColumns = [
      { key: 'id', header: 'Código', width: 50 },
      { key: 'name_es', header: 'Nombre', width: 25 },
      { key: 'is_active', header: 'Activo?', width: 10 },
      { key: 'profile_users_count', header: '# Usuarios', width: 15 },
    ];
    worksheet.columns = fileColumns;
    worksheet.getRow(1).font = { size: 16, bold: true };
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
    worksheet.addRows(data);
    setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    return await workbook.xlsx.writeBuffer();
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
