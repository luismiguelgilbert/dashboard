import supabaseClient from '@/server/utils/supabaseSession';
import { login_credentials } from '@/types/server/system/session';

export default defineEventHandler(async(event) => {
  console.log('login 01');
  console.log(supabaseClient);
  event.context.params = useSanitizeParams(event.context.params);
  const body = await readBody(event);
  console.log('login 02');
  const payload = await login_credentials.cast(body);
  console.log('login 03');
  login_credentials.validate(body, { strict: false, abortEarly: false });
  console.log('login 04');
  
  const { data, error } = await supabaseClient.auth.signInWithPassword(payload);
  console.log('login 05');
  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message });
  }

  setCookie(event, 'sb-access-token', data.session.access_token, { maxAge: 60 * 60 * 24 * 7 });
  setCookie(event, 'sb-refresh-token', data.session.refresh_token, { maxAge: 60 * 60 * 24 * 7 });
  return data;
});