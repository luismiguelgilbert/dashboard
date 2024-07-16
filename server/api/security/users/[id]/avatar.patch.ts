import supabaseClient from '@/server/utils/supabaseSession';
import serverDB from '@/server/utils/db';

export default defineEventHandler(async(event) => {
  event.context.params = useSanitizeParams(event.context.params);
  const id = getRouterParam(event, 'id');
  const files = await readMultipartFormData(event);
  if (files && files[0]) {
    const fileExt = files[0].filename?.split('.').pop();
    const newfilename = `${id}.${fileExt}`;
    const { data: avatarData, error: avatarError } = await supabaseClient.storage
      .from('avatars')
      .upload(newfilename, files[0].data,
        {contentType: 'image', cacheControl: '100', upsert: true}
      );
    
    if (!avatarError && avatarData) {
      const { data } = await supabaseClient.storage
        .from('avatars')
        .getPublicUrl(avatarData.path);

      const sqlUpdateUserData = `update sys_users set
      avatar_url = COALESCE('${data.publicUrl}', avatar_url)
      WHERE id = '${id}'`;
      await serverDB.query(sqlUpdateUserData);
      return new Response('Avatar updated', { status: 200 });
    }
  }
});