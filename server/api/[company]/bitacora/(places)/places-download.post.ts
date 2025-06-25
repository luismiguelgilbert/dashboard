import Excel from 'exceljs';

export default defineEventHandler(async (event) => {
  try {
    await hasPermissions(event, [PermissionsList.BITACORA_PLACES_EXPORT]);
    const { data: payload, error } = await readValidatedBody(event, bitacora_places_query_schema.safeParse);
    const companyId = get_company_schema.parse(event.context.params?.company);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    if (!companyId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid request: a company ID is required.',
      });
    }
    await hasCompanies(event, [companyId]);

    // QUERIES
    const sort = bitacora_places_sort_enum_server.find(s => s.id === payload.sort) || bitacora_places_sort_enum_server['1'];
    const serverDB = useDatabase();
    const userDataQuery = await serverDB.prepare(`
      select
       a.id
      ,initcap(a.name_es) as name_es
      ,initcap(a.name_es_short) as name_es_short
      ,a.is_active
      ,a.avatar_url
      from bita_places a
      where (1 = 1)
      ${companyId ? `and (a.sys_company_id = '${companyId}')` : ''}
      ${payload.search && payload.search.trim()?.length > 0
          ? `and (
            a.name_es ilike '%${payload.search}%'
            or a.name_es_short ilike '%${payload.search}%'
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
    const worksheet = await workbook.addWorksheet('Puntos de Control');
    const fileColumns = [
      { key: 'id', header: 'Código', width: 50 },
      { key: 'name_es', header: 'Nombre', width: 25 },
      { key: 'name_es_short', header: 'Código', width: 25 },
      { key: 'is_active', header: 'Activo?', width: 10 },
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
