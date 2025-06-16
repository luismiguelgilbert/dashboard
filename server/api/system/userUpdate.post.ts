import { supabase } from '@@/server/utils/supabase';
import { base64toBlob } from '~~/app/utils/index';

export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'User not found' });
    }
    const { data: payload, error } = await readValidatedBody(event, profileSchema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }

    // Upsert user info
    const serverDB = useDatabase();
    await serverDB.sql`
      update sys_users set 
      user_name = ${payload.user_name},
      user_lastname = ${payload.user_lastname}
      where id = ${user.userId}
    `;

    // Upload and Upsert avatar URL if file is provided
    if (payload.avatar_file) {
      const fileExt = payload.avatar_file.split('/')[1]?.split(';')[0];
      const filename = `sys-users/${user.userId}.${fileExt}`;
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
        await serverDB.sql`update sys_users set
          avatar_url = COALESCE(${fileURL.publicUrl}, avatar_url)
          WHERE id = ${user.userId}`;
      }
    }
  } catch (err) {
    console.error(`Error at ${event.method} ${event.path}.`, err);
    throw createError({
      statusCode: 500,
      statusMessage: typeof err === 'object' && err !== null && 'message' in err
        ? (err as { message?: string }).message ?? `Unhandled exception getting companies`
        : `Unhandled exception getting companies`,
    });
  }
});
