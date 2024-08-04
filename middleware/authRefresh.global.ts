import { unprotectedPaths } from '@/types/unsecuredRoutes';

export default defineNuxtRouteMiddleware(async (to) => {
  if (!process.server) {
    const accessToken = useCookie('sb-access-token');
    const refreshToken = useCookie('sb-refresh-token');
    const isProtectedPath = !unprotectedPaths.includes(to.fullPath);
    if ((!accessToken.value || !refreshToken.value) && isProtectedPath) {
      const { supabase } = useSupabase();
      const { data, error } = await supabase.auth.refreshSession();
      if (!error && data) {
        document.cookie = `sb-access-token=${data.session?.access_token}; path=/`;
        document.cookie = `sb-refresh-token=${data.session?.refresh_token}; path=/`;
        useToast().add({
          title: 'Su sesión expiró y fue actualizada.',
          color: 'amber',
          icon: 'i-heroicons-shield-exclamation',
        });
        await window.location.replace(to.fullPath);
      }
    }
  }
});