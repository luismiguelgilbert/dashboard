import { userDataForm, type type_userDataForm } from '@/types/server/sys_users';
import { type type_sys_profiles } from '@/types/server/sys_profiles';
import { type type_sys_companies } from '@/types/server/sys_companies';

export const useSecurityUsersForm = () => {
  const state = useState('useSecurityUsersForm', () => { return {
    isLoading: false as boolean,
    userData: {} as type_userDataForm,
    userCompanies: [] as String[],
    avatar: null as File|null,
    profileOptions: [] as type_sys_profiles[],
    companyOptions: [] as type_sys_companies[],
  }});

  const resetUserData = () => { 
    state.value.userData = {
      ...state.value.userData,
      id: '',
      user_name: '',
      user_lastname: '',
      user_sex: false,
      avatar_url: '',
      email: '',
      sys_profile_id: -1,
      dark_enabled: true,
      default_dark_color: 'zinc',
      default_color: 'indigo',
      prefered_company_id: '',
    };
    state.value.avatar = null;
    state.value.userCompanies = [];
    state.value.profileOptions = [];
  };

  const validateUserData = async () => {
    const isUserDataValid = await  userDataForm.safeParse(state.value.userData);
    const isCompaniesDataValid = state.value.userCompanies.length > 0;

    return isUserDataValid.success && isCompaniesDataValid;
  };

  return { state, resetUserData, validateUserData };
};