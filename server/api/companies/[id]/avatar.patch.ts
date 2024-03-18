import serverDB from '@/server/utils/db';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler( async (event) => {
  const id = (event.context.params?.id);
  const files = await readMultipartFormData(event);
  if (files && files.length > 0) {
    const fileExt = files[0].filename.split('.').pop();
    const newfilename = `${id}.${fileExt}`;
    const supabaseClient = await serverSupabaseClient(event);
    const { data: updloadedFileData, error: uploadError } = await supabaseClient.storage
      .from('avatars')
      .upload(newfilename, files[0].data,
        {contentType: 'image', cacheControl: '100', upsert: true}
      );

    if (!uploadError && updloadedFileData) {
      const { data: avatarPathData } = supabaseClient.storage.from('avatars').getPublicUrl(updloadedFileData.path);

      const sqlUpdateUserData = `update sys_companies set
       avatar_url = COALESCE('${avatarPathData.publicUrl}', avatar_url)
       WHERE id = '${id}'`;
      await serverDB.query(sqlUpdateUserData);
      return new Response('Avatar updated', { status: 200 });
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error uploading file.',
      });
    }
  }
});