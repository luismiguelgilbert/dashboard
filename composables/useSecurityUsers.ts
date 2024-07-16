import { FilterQueriesKeys } from '@/types/server/filter_keys';
import { type type_filter_selection, type type_filter_payload } from '@/types/client/filter_payload';
import { type type_sys_users } from '@/types/server/security/sys_users';

export const useSecurityUsers = () => {
  const state = useState('useSecurityUsers', () => { return {
    isLoading: false,
    showFilterPanel: false,
    filterPayload: {
      pageSize: 25 as number,
      filterSelection: {} as type_filter_selection,
      sortBy: FilterQueriesKeys.SECURITY_USERS_LASTNAME,
      sortByOrder: true,
      page: 1,
      searchString: ''
    } as type_filter_payload,
    selectedId: null as string | null,
    selectedRecord: null as type_sys_users | null,
  };});
  const hasFilter = computed(() => {
    const keys = Object.keys(state.value.filterPayload.filterSelection);
    return keys.some(x => state.value.filterPayload.filterSelection[x].length > 0);
  });

  return { state, hasFilter };
};