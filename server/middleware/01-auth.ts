import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const requestedURL = await getRequestURL(event);
  const unprotectedPaths = ['/login', '/confirm', '/api/login', '/api/refresh-session'];
  const isProtectedPath = requestedURL.pathname.startsWith('/api')
    && !unprotectedPaths.includes(requestedURL.pathname);
  
  if (isProtectedPath) {
    const sessionCookie = getCookie(event, 'sb-access-token') || '';
    const user: jwt.JwtPayload = jwt.decode(sessionCookie) as jwt.JwtPayload;
  
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }
    user
    event.context.user = {...user, id: user.sub};
  }
})