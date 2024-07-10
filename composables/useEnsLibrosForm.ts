import { type type_ens_libros } from '@/types/server/ens/ens_libros';

export const useEnsLibrosForm = () => {
  const state = useState('useEnsLibrosForm', () => { return {
    isLoading: false as boolean,
    isSaving: false as boolean,
    data: null as type_ens_libros | null,
  };});

  const resetState = () => { 
    state.value.data = null,
    state.value.isLoading = false;
    state.value.isSaving = false;
  };

  return { state, resetState };
};