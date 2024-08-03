export default defineNuxtRouteMiddleware(async () => {
  const accessToken = useCookie('sb-access-token');
  const refreshToken = useCookie('sb-refresh-token');
  if (!accessToken.value || !refreshToken.value) {
    const { supabase } = useSupabase();
    const { data, error } = await supabase.auth.refreshSession();
    if (!error && data) {
      document.cookie = `sb-access-token=${data.session?.access_token}; path=/`;
      document.cookie = `sb-refresh-token=${data.session?.refresh_token}; path=/`;
      useToast().add({
        title: 'Su sesión expiró y fue actualizada. Por favor, recargue la página.',
        color: 'amber',
        icon: 'i-heroicons-shield-exclamation',
      });
    }
  }
});