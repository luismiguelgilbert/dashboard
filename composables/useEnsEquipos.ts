import { type type_ens_teams } from '~/types/server/ens_types';

export const useEnsEquipos = () => {
  const state = useState('useEnsEquipos', () => { return {
    isLoading: false,
    filterPayload: {
      pageSize: 25,
      filterBy: [],
      sortBy: 1,
      page: 1,
      searchString: ''
    },
    selectedTeam: null as type_ens_teams | null,
  };});

  return { state };
};