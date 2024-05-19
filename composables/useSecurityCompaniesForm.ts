import { type type_companyDataForm, type type_companyPayload, type type_roleUsers } from '@/types/server/sys_companies';

export const useSecurityCompaniesForm = () => {
  const state = useState('useSecurityCompaniesForm', () => { return {
    isLoading: false as boolean,
    isSaving: false as boolean,
    data: {} as type_companyPayload,
    companyUsers: [] as type_roleUsers,
    avatar: null as File|null,
  };});

  const resetState = () => { 
    state.value.data = {
      companyData: {} as type_companyDataForm,
    };
    state.value.isLoading = false;
    state.value.isSaving = false;
    state.value.companyUsers = [];
    state.value.avatar = null;
  };

  return { state, resetState };
};