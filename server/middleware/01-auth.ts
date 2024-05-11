import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const requestedURL = await getRequestURL(event);
  const unprotectedPaths = ['/login', '/confirm', '/api/login', '/api/refresh-session'];
  const isProtectedPath = requestedURL.pathname.startsWith('/api')
    && !unprotectedPaths.includes(requestedURL.pathname);
  
  if (isProtectedPath) {
    const user = await serverSupabaseUser(event);
  
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }
    event.context.user = user;
  }
})