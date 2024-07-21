import { type type_sys_roles } from '@/types/server/security/sys_roles';

export const useSecurityRolesForm = () => {
  const state = useState('useSecurityRolesForm', () => { return {
    isLoading: false as boolean,
    isSaving: false as boolean,
    data: null as type_sys_roles | null,
  };});

  const resetState = () => { 
    state.value.data = null;
    state.value.isLoading = false;
    state.value.isSaving = false;
  };

  return { state, resetState };
};