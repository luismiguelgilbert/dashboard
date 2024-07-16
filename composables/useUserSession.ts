import { type InferType } from 'yup';
import { type UseUserSession } from '@/types/server/sys_users';

export const useUserSession = () => {
  const sessionData = useState<InferType<typeof UseUserSession>>('sessionData', () => { return {
    userData: null,
    userCompanies: null,
    userCompany: null,
    userMenuData: null,
  };});

  const handleUnauthorized = async() => {
    useToast().add({
      title: 'No encontramos una sesión activa.',
      color: 'rose',
      icon: 'i-heroicons-shield-exclamation',
    });
    navigateTo('/auth/login');
  };

  return { sessionData, handleUnauthorized };
};