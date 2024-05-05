import { userDataForm, type type_userDataForm } from '@/types/server/sys_users';
import { type type_sys_profiles } from '@/types/server/sys_profiles';
import { type type_sys_companies } from '@/types/server/sys_companies';

export const useSecurityUsersForm = () => {
  const state = useState('useSecurityUsersForm', () => { return {
    isLoading: false as boolean,
    data: {} as type_userDataForm,
    userCompanies: [] as String[],
    avatar: null as File|null,
    profileOptions: [] as type_sys_profiles[],
    companyOptions: [] as type_sys_companies[],
  }});

  const resetState = () => { 
    state.value.data = {} as type_userDataForm;
    state.value.avatar = null;
    state.value.userCompanies = [];
    state.value.profileOptions = [];
  };

  const validateUserData = async () => {
    try {
      const isUserDataValid = await userDataForm.isValid(state.value.data);
      const isCompaniesDataValid = state.value.userCompanies.length > 0;
  
      return isUserDataValid && isCompaniesDataValid;
    } catch (error) {
      return false;
    }
  };

  return { state, resetState, validateUserData };
};