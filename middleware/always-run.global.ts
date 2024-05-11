export default defineNuxtRouteMiddleware((to) => {
  const unprotectedPaths = ['/auth/confirm', '/auth/forgot', '/auth/login', '/auth/signup'];
  const user = useSupabaseUser();

  if (!unprotectedPaths.includes(to.path)) {
    if (!user.value) {
      return navigateTo('/auth/login');
    }
  }
});