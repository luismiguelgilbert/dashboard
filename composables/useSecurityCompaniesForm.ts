import { type type_sys_companies } from '@/types/server/security/sys_companies';

export const useSecurityCompaniesForm = () => {
  const state = useState('useSecurityCompaniesForm', () => { return {
    isLoading: false as boolean,
    isSaving: false as boolean,
    data: null as type_sys_companies | null,
    avatar: null as File|null,
  };});

  const resetState = () => { 
    state.value.data = null;
    state.value.isLoading = false;
    state.value.isSaving = false;
    state.value.avatar = null;
  };

  return { state, resetState };
};