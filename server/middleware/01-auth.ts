import supabaseClient from '@/server/utils/supabaseSession';
import { unprotectedPaths } from '@/types/unsecuredRoutes';

export default defineEventHandler(async (event) => {
  const requestedURL = await getRequestURL(event);
  const isProtectedPath = requestedURL.pathname.startsWith('/api')
    && !unprotectedPaths.includes(requestedURL.pathname);
  
  if (isProtectedPath) {
    const sessionCookie = getCookie(event, 'sb-access-token') || '';
    if (!sessionCookie) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized123',
      });
    }
    const { data, error } = await supabaseClient.auth.getUser(sessionCookie);
    if (error || !data.user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      });
    }
    event.context.user = data.user;
  }
});