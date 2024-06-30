import { type type_ens_servicios } from '@/types/server/ens/ens_servicios';

export const useEnsServiciosForm = () => {
  const state = useState('useEnsServiciosForm', () => { return {
    isLoading: false as boolean,
    isSaving: false as boolean,
    data: null as type_ens_servicios | null,
  };});

  const resetState = () => { 
    state.value.data = null;
    state.value.isLoading = false;
    state.value.isSaving = false;
  };

  return { state, resetState };
};