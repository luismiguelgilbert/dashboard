import { supabase } from '@@/server/utils/supabase';
import { base64toBlob } from '~~/app/utils/index';

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);
  const serverDB = useDatabase();
  try {
    const { data: payload, error } = await readValidatedBody(event, sys_companies_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }

    if (payload.is_new) {
      hasPermissions(event, [PermissionsList.COMPANIES_CREATE])
    } else {
      hasPermissions(event, [PermissionsList.COMPANIES_EDIT]);
    }

    await serverDB.exec('BEGIN');

    // Upsert data
    await serverDB.sql`insert into sys_companies 
      (id, company_number, name_es, name_es_short, billing_phone, billing_address, is_active, updated_by)
      values (
        ${payload.id},
        ${payload.company_number},
        ${payload.name_es},
        ${payload.name_es_short},
        ${payload.billing_phone},
        ${payload.billing_address},
        ${payload.is_active},
        ${user?.userId}
      )
      ON CONFLICT(id) DO UPDATE SET
        company_number = ${payload.company_number},
        name_es = ${payload.name_es},
        name_es_short = ${payload.name_es_short},
        billing_phone = ${payload.billing_phone},
        billing_address = ${payload.billing_address},
        is_active = ${payload.is_active},
        updated_by = ${user?.userId}
    `;

    // Upload and Upsert avatar URL if file is provided
    if (payload.avatar_file) {
      const fileExt = payload.avatar_file.split('/')[1]?.split(';')[0];
      const filename = `sys-companies/${payload.id}.${fileExt}`;
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
        await serverDB.sql`update sys_companies set
          avatar_url = COALESCE(${fileURL.publicUrl}, avatar_url)
          WHERE id = ${payload.id}`;
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
