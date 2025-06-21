import Excel from 'exceljs';

export default defineEventHandler(async (event) => {
  try {
    await hasPermissions(event, [PermissionsList.USERS_EXPORT]);
    const { data: payload, error } = await readValidatedBody(event, sys_users_query_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }

    // QUERIES
    const sort = sys_users_sort_enum_server.find(s => s.id === payload.sort) || sys_users_sort_enum_server['1'];
    const serverDB = useDatabase();
    const userDataQuery = await serverDB.prepare(`
      select
      a.id
      ,initcap(a.user_name) as user_name
      ,initcap(a.user_lastname) as user_lastname
      ,a.is_active
      ,a.user_sex
      ,a.avatar_url
      ,a.email
      ,b.name_es as sys_profile_name
      from sys_users a
      inner join sys_profiles b on a.sys_profile_id = b.id
      where (1 = 1)
      ${payload.search && payload.search.trim()?.length > 0
          ? `and (
            a.user_name ilike '%${payload.search.trim()}%'
            or a.user_lastname ilike '%${payload.search.trim()}%'
            or a.email ilike '%${payload.search.trim()}%'
            or b.name_es ilike '%${payload.search.trim()}%'
          )`
          : ''
      }
      ${payload.is_active && payload.is_active.length > 0
          ? `and (a.is_active in (${payload.is_active.join(',')}))`
          : ''
      }
      ${payload.user_sex && payload.user_sex.length > 0
          ? `and (a.user_sex in (${payload.user_sex.join(',')}))`
          : ''
      }
      ORDER BY ${sort?.label} ${payload.order}
    `);

    const data = await userDataQuery.all();

    const workbook = new Excel.Workbook();
    const worksheet = await workbook.addWorksheet('Usuarios');
    const fileColumns = [
      { key: 'id', header: 'Código', width: 50 },
      { key: 'user_name', header: 'Nombres', width: 25 },
      { key: 'user_lastname', header: 'Apellidos', width: 25 },
      { key: 'user_sex', header: 'Sexo', width: 10 },
      { key: 'is_active', header: 'Activo?', width: 10 },
      { key: 'email', header: 'Email', width: 35 },
      { key: 'sys_profile_name', header: 'Perfil', width: 25 },
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
