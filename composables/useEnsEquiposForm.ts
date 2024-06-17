import { type type_ens_teams } from '@/types/server/ens/ens_teams';

export const useEnsEquiposForm = () => {
  const state = useState('useEnsEquiposForm', () => { return {
    isLoading: false as boolean,
    isSaving: false as boolean,
    data: null as type_ens_teams | null,
  };});

  const resetState = () => { 
    state.value.data = null,
    state.value.isLoading = false;
    state.value.isSaving = false;
  };

  return { state, resetState };
};