import Excel from 'exceljs';

export default defineEventHandler(async (event) => {
  try {
    await hasPermissions(event, [PermissionsList.BITACORA_RIDES_EXPORT]);
    const { data: payload, error } = await readValidatedBody(event, bitacora_rides_query_schema.safeParse);
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
    const sort = bitacora_rides_sort_enum_server.find(s => s.id === payload.sort) || bitacora_rides_sort_enum_server['1'];
    const serverDB = useDatabase();
    const userDataQuery = await serverDB.prepare(`
      select
       a.id
      ,a.car_id
      ,d.name_es as car_name_es
      ,d.name_es_short as car_name_es_short
      ,COALESCE(a.driver, '') as driver
      ,COALESCE(a.reason_id, '') as reason_id
      ,c.name_es as reason_name
      ,to_char (a.ride_start::timestamp at time zone 'UTC', 'YYYY-MM-DD" "HH24:MI:00+00') as ride_start
      ,a.ride_start_km
      ,a.ride_start_comments
      ,to_char (a.ride_end::timestamp at time zone 'UTC', 'YYYY-MM-DD" "HH24:MI:00+00') as ride_end
      ,a.ride_end_km
      ,a.ride_end_comments
      ,a.is_active
      ,a.is_complete
      ,b.user_name || ' ' || b.user_lastname as updated_by
      from bita_rides a
      inner join sys_users b on a.updated_by = b.id
      inner join bita_rides_reasons c on a.sys_company_id = c.sys_company_id and a.reason_id = c.id
      inner join bita_cars d on a.sys_company_id = d.sys_company_id and a.car_id = d.id
      where (1 = 1)
      and a.is_complete = False
      ${companyId ? `and (a.sys_company_id = '${companyId}')` : ''}
      ${placeId ? `and (a.place_id = '${placeId}')` : ''}
      ${payload.is_active && payload.is_active.length > 0
          ? `and (a.is_active in (${payload.is_active.join(',')}))`
          : ''
      }
      ORDER BY ${sort?.label} ${payload.order}
    `);

    const data = await userDataQuery.all();

    const workbook = new Excel.Workbook();
    const worksheet = await workbook.addWorksheet('Viajes');
    const fileColumns = [
      { key: 'driver', header: 'Responsable', width: 30 },
      { key: 'reason_name', header: 'Motivo', width: 20 },
      { key: 'ride_start', header: 'Fecha Ingreso', width: 20 },
      { key: 'ride_start_km', header: 'Pregunta Por', width: 20 },
      { key: 'ride_start_comment', header: 'Area a la que se dirige', width: 20 },
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
