import { type InferType } from 'yup';
import { type UseUserSession } from '@/types/server/sys_users';

export const useUserSession = () => {
  const sessionData = useState<InferType<typeof UseUserSession>>('sessionData', () => { return {
    userData: null,
    userCompanies: null,
    userCompany: null,
    userMenuData: null,
  };});

  return { sessionData };
};