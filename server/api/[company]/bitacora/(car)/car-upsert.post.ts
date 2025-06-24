import { base64toBlob } from '~~/app/utils/index';

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);
  const serverDB = useDatabase();
  try {
    const { data: payload, error } = await readValidatedBody(event, bitacora_cars_schema.safeParse);
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
    if (payload.is_new) {
      hasPermissions(event, [PermissionsList.BITACORA_CARS_CREATE])
    } else {
      hasPermissions(event, [PermissionsList.BITACORA_CARS_EDIT]);
    }

    await serverDB.exec('BEGIN');

    // Upsert data
    await serverDB.sql`insert into bita_cars
      (id, sys_company_id, name_es, name_es_short, is_active, updated_by)
      values (
        ${payload.id},
        ${companyId},
        ${payload.name_es},
        ${payload.name_es_short},
        ${payload.is_active},
        ${user?.userId}
      )
      ON CONFLICT(id) DO UPDATE SET
        name_es = ${payload.name_es},
        name_es_short = ${payload.name_es_short},
        avatar_url = ${payload.avatar_url},
        is_active = ${payload.is_active},
        updated_by = ${user?.userId}
    `;

    // Upload and Upsert avatar URL if file is provided
    if (payload.avatar_file) {
      const fileExt = payload.avatar_file.split('/')[1]?.split(';')[0];
      const filename = `bita-cars/${payload.id}.${fileExt}`;
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
        await serverDB.sql`update bita_cars set
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
