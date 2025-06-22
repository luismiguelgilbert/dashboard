import Excel from 'exceljs';

export default defineEventHandler(async (event) => {
  try {
    await hasPermissions(event, [PermissionsList.COMPANIES_EXPORT]);
    const { data: payload, error } = await readValidatedBody(event, sys_companies_query_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }

    // QUERIES
    const sort = sys_companies_sort_enum_server.find(s => s.id === payload.sort) || sys_companies_sort_enum_server['1'];
    const serverDB = useDatabase();
    const userDataQuery = await serverDB.prepare(`
      select
       a.id
      ,initcap(a.name_es) as name_es
      ,initcap(a.name_es_short) as name_es_short
      ,a.company_number
      ,a.billing_phone
      ,a.billing_address
      ,a.is_active
      ,a.avatar_url
      from sys_companies a
      where (1 = 1)
      ${payload.search && payload.search.trim()?.length > 0
          ? `and (
            a.name_es ilike '%${payload.search}%'
            a.name_es_short ilike '%${payload.search}%'
            a.company_number ilike '%${payload.search}%'
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
    const worksheet = await workbook.addWorksheet('Organizaciones');
    const fileColumns = [
      { key: 'id', header: 'Código', width: 50 },
      { key: 'name_es', header: 'Nombre', width: 25 },
      { key: 'name_es_short', header: 'Razón Social', width: 25 },
      { key: 'company_number', header: 'RUC', width: 25 },
      { key: 'is_active', header: 'Activo?', width: 10 },
      { key: 'billing_phone', header: 'Teléfono', width: 15 },
      { key: 'billing_address', header: 'Dirección', width: 25 },
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
