import { type type_filter_search_option } from '~/types/server/filter_search';
import { type type_ens_teams } from '~/types/server/ens_teams';

export const useEnsEquipos = () => {
  const state = useState('useEnsEquipos', () => { return {
    isLoading: false,
    showFilterPanel: false,
    filterPayload: {
      pageSize: 25,
      filterBy: [] as Array<type_filter_search_option>,
      sortBy: 1,
      sortByOrder: true,
      page: 1,
      searchString: ''
    },
    selectedId: null as string | null,
    selectedTeam: null as type_ens_teams | null,
  };});
  const hasFilter = computed(() => state.value.filterPayload.filterBy.some(x => x.options && x.options?.length > 0));

  return { state, hasFilter };
};