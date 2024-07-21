import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_filter_selection, type type_filter_payload } from '@/types/client/filter_payload';
import { type type_sys_roles } from '@/types/server/security/sys_roles';

export const useSecurityRoles = () => {
  const state = useState('useSecurityRoles', () => { return {
    isLoading: false,
    showFilterPanel: false,
    filterPayload: {
      pageSize: 25 as number,
      filterSelection: {} as type_filter_selection,
      sortBy: FilterQueriesKeys.SECURITY_ROLES_NAME,
      sortByOrder: true,
      page: 1,
      searchString: ''
    } as type_filter_payload,
    selectedId: null as number | null,
    selectedRecord: null as type_sys_roles | null,
  };});
  const hasFilter = computed(() => {
    const keys = Object.keys(state.value.filterPayload.filterSelection);
    return keys.some(x => state.value.filterPayload.filterSelection[x].length > 0);
  });

  return { state, hasFilter };
};