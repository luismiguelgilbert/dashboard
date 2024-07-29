import { type InferType } from 'yup';
import { type UseUserSession } from '@/types/server/sys_users';

export const useUserSession = () => {
  const sessionData = useState<InferType<typeof UseUserSession>>('sessionData', () => { return {
    userData: null,
    userCompanies: null,
    userCompany: null,
    userMenuData: null,
  };});

  const handleUnauthorized = async(refresh: any) => {
    try {
      const { supabase } = useSupabase();
      const { data, error } = await supabase.auth.refreshSession();
      if (error) { throw error; }
      document.cookie = `sb-access-token=${data.session?.access_token}; path=/`;
      document.cookie = `sb-refresh-token=${data.session?.refresh_token}; path=/`;
      useToast().add({
        title: 'Su sesión expiró y fue actualizada. Por favor, recargue la página.',
        color: 'amber',
        icon: 'i-heroicons-shield-exclamation',
      });
      refresh();
    } catch (error) {
      useToast().add({
        title: 'No encontramos una sesión activa.',
        color: 'rose',
        icon: 'i-heroicons-shield-exclamation',
      });
      await navigateTo('/auth/login');
    }
  };

  return { sessionData, handleUnauthorized };
};