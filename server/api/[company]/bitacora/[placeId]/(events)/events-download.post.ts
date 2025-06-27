import Excel from 'exceljs';

export default defineEventHandler(async (event) => {
  try {
    await hasPermissions(event, [PermissionsList.BITACORA_EVENTS_EXPORT]);
    const { data: payload, error } = await readValidatedBody(event, bitacora_events_query_schema.safeParse);
    const companyId = get_company_schema.parse(event.context.params?.company);
    const placeId = get_company_schema.parse(event.context.params?.placeId);
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
    const sort = bitacora_events_sort_enum_server.find(s => s.id === payload.sort) || bitacora_events_sort_enum_server['1'];
    const serverDB = useDatabase();
    const userDataQuery = await serverDB.prepare(`
      select
       a.id
      ,a.event_at::text as event_at
      ,a.comments
      ,a.is_active
      ,a.is_critical
      ,a.avatar_url
      ,b.user_name || ' ' || b.user_lastname as responsible
      from bita_events a
      inner join sys_users b on a.updated_by = b.id
      where (1 = 1)
      ${companyId ? `and (a.sys_company_id = '${companyId}')` : ''}
      ${placeId ? `and (a.place_id = '${placeId}')` : ''}
      ${payload.is_active && payload.is_active.length > 0
          ? `and (a.is_active in (${payload.is_active.join(',')}))`
          : ''
      }
      ${payload.is_critical && payload.is_critical.length > 0
          ? `and (a.is_critical in (${payload.is_critical.join(',')}))`
          : ''
      }
      ORDER BY ${sort?.label} ${payload.order}
    `);

    const data = await userDataQuery.all();

    const workbook = new Excel.Workbook();
    const worksheet = await workbook.addWorksheet('Puntos de Control');
    const fileColumns = [
      { key: 'event_at', header: 'Código', width: 30 },
      { key: 'responsible', header: 'Código', width: 30 },
      { key: 'comments', header: 'Nombre', width: 100 },
      { key: 'is_critical', header: 'Crítico?', width: 10 },
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
