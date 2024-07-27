import { type type_ens_members } from '@/types/server/ens/ens_members';

export const useEnsEquipistasForm = () => {
  const state = useState('useEnsEquipistasForm', () => { return {
    isLoading: false as boolean,
    isSaving: false as boolean,
    data: null as type_ens_members | null,
  };});

  const resetState = () => { 
    state.value.data = null,
    state.value.isLoading = false;
    state.value.isSaving = false;
  };

  return { state, resetState };
};