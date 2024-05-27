// import { type type_ens_teams } from '~/types/server/ens_types';

export const useEnsEquipos = () => {
  const state = useState('useEnsEquipos', () => { return {
    isLoading: false,
    showFilterPanel: false,
    filterPayload: {
      pageSize: 25,
      filterBy: [],
      sortBy: 1,
      sortByOrder: true,
      page: 1,
      searchString: ''
    },
    selectedId: null as string | null,
  };});

  return { state };
};