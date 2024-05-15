import { type type_userCompaniesForm } from '@/types/server/sys_users';
import { type type_userPayload, type type_userDataForm } from '@/types/server/sys_users';
import { type type_sys_profiles } from '@/types/server/sys_profiles';
import { type type_sys_companies } from '@/types/server/sys_companies';

export const useSecurityUsersForm = () => {
  const state = useState('useSecurityUsersForm', () => { return {
    isLoading: false as boolean,
    isSaving: false as boolean,
    data: {} as type_userPayload,
    userCompanies: [] as type_userCompaniesForm,
    avatar: null as File|null,
    profileOptions: [] as type_sys_profiles[],
    companyOptions: [] as type_sys_companies[],
  };});

  const resetState = () => { 
    state.value.data = {
      userData: {} as type_userDataForm,
      userCompanies: [],
    };
    state.value.avatar = null;
    state.value.userCompanies = [];
    state.value.profileOptions = [];
  };

  return { state, resetState };
};