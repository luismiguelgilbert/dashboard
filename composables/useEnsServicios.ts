import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_filter_selection, type type_filter_payload } from '@/types/client/filter_payload';
import { type type_ens_servicios } from '@/types/server/ens/ens_servicios';

export const useEnsServicios = () => {
  const state = useState('useEnsServicios', () => { return {
    isLoading: false,
    showFilterPanel: false,
    filterPayload: {
      pageSize: 25 as number,
      filterSelection: {} as type_filter_selection,
      sortBy: FilterQueriesKeys.ENS_SERVICIOS_NAME,
      sortByOrder: true,
      page: 1,
      searchString: ''
    } as type_filter_payload,
    selectedId: null as string | null,
    selectedTeam: null as type_ens_servicios | null,
  };});
  const hasFilter = computed(() => {
    const keys = Object.keys(state.value.filterPayload.filterSelection);
    return keys.some(x => state.value.filterPayload.filterSelection[x].length > 0);
  });

  return { state, hasFilter };
};