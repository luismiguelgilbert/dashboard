import { type type_sys_users } from '@/types/server/security/sys_users';

export const useSecurityUsersForm = () => {
  const state = useState('useSecurityUsersForm', () => { return {
    isLoading: false as boolean,
    isSaving: false as boolean,
    data: null as type_sys_users | null,
    avatar: null as File|null,
  };});

  const resetState = () => { 
    state.value.data = null,
    state.value.isLoading = false;
    state.value.isSaving = false;
    state.value.avatar = null;
  };

  return { state, resetState };
};