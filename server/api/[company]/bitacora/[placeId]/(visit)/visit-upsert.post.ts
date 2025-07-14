import { base64toBlob } from '~~/app/utils/index';

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);
  const serverDB = useDatabase();
  try {
    const { data: payload, error } = await readValidatedBody(event, bitacora_visits_schema.safeParse);
    const companyId = get_company_schema.parse(event.context.params?.company);
    const placeId = get_company_schema.parse(event.context.params?.placeId);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    if (!companyId || !placeId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid request: a company ID and a place ID is required.',
      });
    }
    await hasCompanies(event, [companyId]);
    if (payload.is_new) {
      hasPermissions(event, [PermissionsList.BITACORA_EVENTS_CREATE])
    } else {
      hasPermissions(event, [PermissionsList.BITACORA_EVENTS_EDIT]);
    }

    await serverDB.exec('BEGIN');

    // Upsert data
    await serverDB.sql`insert into bita_visits
      (id, sys_company_id, place_id, visit_start, visit_end, visitor_name, visitor_number, visitor_company, is_complete, is_active
      , visited_name, visited_area, vehicle_name, vehicle_plate, reason_id, comments_in, comments_out, updated_by)
      values (
        ${payload.id},
        ${companyId},
        ${placeId},
        ${payload.visit_start},
        ${payload.visit_end},
        ${payload.visitor_name},
        ${payload.visitor_number},
        ${payload.visitor_company},
        ${payload.is_complete},
        ${payload.is_active},
        ${payload.visited_name},
        ${payload.visited_area},
        ${payload.vehicle_name},
        ${payload.vehicle_plate},
        ${payload.reason_id},
        ${payload.comments_in},
        ${payload.comments_out},
        ${user?.userId}
      )
      ON CONFLICT(id) DO UPDATE SET
        visit_start =${payload.visit_start},
        visit_end =${payload.visit_end},
        is_active = ${payload.is_active},
        is_complete = ${payload.is_complete},
        comments_out = ${payload.comments_out},
        updated_by = ${user?.userId}
    `;

    // Upload and Upsert avatar URL if file is provided
    if (payload.avatar_file) {
      const fileExt = payload.avatar_file.split('/')[1]?.split(';')[0];
      const filename = `bita-visits/${payload.id}.${fileExt}`;
      const blob = base64toBlob(payload.avatar_file, `image/${fileExt}`);
      if (blob) {
        const { error: fileError } = await supabase.storage.from('avatars')
          .upload(filename, blob, {
            cacheControl: '0',
            upsert: true,
          });
        if (fileError) {
          throw createError({
            statusCode: 500,
            statusMessage: `Error uploading file: ${fileError.message}`,
          });
        }
        const { data: fileURL } = supabase.storage.from('avatars').getPublicUrl(filename);
        await serverDB.sql`update bita_visits set
          avatar_url = COALESCE(${fileURL.publicUrl}, avatar_url)
          WHERE id = ${payload.id} and sys_company_id = ${companyId}`;
      }
    }

    await serverDB.exec('COMMIT');
    return new Response('Record saved', { status: 200 });
  } catch (err) {
    console.error(`Error at ${event.method} ${event.path}.`, err);
    await serverDB.exec('ROLLBACK');
    throw createError({
      statusCode: 500,
      statusMessage: typeof err === 'object' && err !== null && 'message' in err
        ? (err as { message?: string }).message ?? `Unhandled exception`
        : `Unhandled exception`,
    });
  }
});
