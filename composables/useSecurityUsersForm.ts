import { userDataForm, type type_userDataForm } from '@/types/server/sys_users';
import { type type_sys_profiles } from '@/types/server/sys_profiles';
import { type type_sys_companies } from '@/types/server/sys_companies';

export const useSecurityUsersForm = () => {
  const state = useState('useSecurityUsersForm', () => { return {
    isLoading: false as boolean,
    // userData: {} as type_userDataForm,
    // userData: userDataForm.parse({}),
    data: userDataForm.parse({}),
    // data: {} as type_userDataForm,
    userCompanies: [] as String[],
    avatar: null as File|null,
    profileOptions: [] as type_sys_profiles[],
    companyOptions: [] as type_sys_companies[],
  }});

  const resetUserData = () => { 
    state.value.data = userDataForm.parse({});
    state.value.avatar = null;
    state.value.userCompanies = [];
    state.value.profileOptions = [];
  };

  const validateUserData = async () => {
    try {
      const isUserDataValid = userDataForm.safeParse(state.value.data);
      const isCompaniesDataValid = state.value.userCompanies.length > 0;
  
      return isUserDataValid.success && isCompaniesDataValid;
    } catch (error) {
      return false;
    }
  };

  return { state, resetUserData, validateUserData };
};