import { type type_ens_teams } from '@/types/server/ens_teams';

export const useEnsEquiposForm = () => {
  const state = useState('useEnsEquiposForm', () => { return {
    isLoading: false as boolean,
    isSaving: false as boolean,
    data: {} as type_ens_teams,
  };});

  const resetState = () => { 
    state.value.data = {} as type_ens_teams;
    state.value.isLoading = false;
    state.value.isSaving = false;
  };

  return { state, resetState };
};