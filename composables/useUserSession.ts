import { z } from 'zod';
import { type UseUserSession } from '@/types/server/sys_users';

export const useUserSession = () => {
  const sessionData = useState<z.infer<typeof UseUserSession>>('sessionData', () => { return {
    userData: null,
    userCompanies: null,
    userCompany: null,
    userMenuData: null,
  }});

  return { sessionData };
};