import { type type_userDataForm } from '@/types/server/sys_users';
import { type type_sys_profiles } from '@/types/server/sys_profiles';
import { type type_sys_companies } from '@/types/server/sys_companies';

export const useSecurityUsersForm = () => {
  const isLoading = useState<boolean>('isLoading', () => false);
  const userData = useState<type_userDataForm>('userData');
  const userCompanies = useState<string[]>('userCompanies', () => []);
  const profileOptions = useState<type_sys_profiles[]>('profileOptions', () => []);
  const companyOptions = useState<type_sys_companies[]>('companyOptions', () => []);

  const resetUserData = () => { userData.value = {
    ...userData.value,
    id: '',
    user_name: '',
    user_lastname: '',
    avatar_url: '',
    email: '',
    sys_profile_id: -1,
    dark_enabled: true,
    default_dark_color: 'zinc',
    default_color: 'indigo',
  } };

  return { isLoading, userData, userCompanies, profileOptions, companyOptions, resetUserData };
};