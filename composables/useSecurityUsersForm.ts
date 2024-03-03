import { sys_users, type type_sys_users } from '@/types/server/sys_users';
import { type type_sys_profiles } from '@/types/server/sys_profiles';
import { type type_sys_companies } from '@/types/server/sys_companies';

export const useSecurityUsersForm = () => {
  const isLoading = useState<boolean>('isLoading', () => false);
  // const userData = useState<type_sys_users>('userData', () => sys_users.parse({}));
  const userData = useState<type_sys_users>('userData');
  const userCompanies = useState<string[]>('userCompanies', () => []);
  const profileOptions = useState<type_sys_profiles[]>('profileOptions', () => []);
  const companyOptions = useState<type_sys_companies[]>('companyOptions', () => []);
  const resetUserData = () => { userData.value = sys_users.parse({}) };

  return { isLoading, userData, userCompanies, profileOptions, companyOptions, resetUserData };
};