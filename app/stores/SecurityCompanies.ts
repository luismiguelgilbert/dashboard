export const useSecurityCompaniesStore = defineStore('securityCompanies', () => {
  const queryPayload = ref<sys_companies_query>({
    searchString: '',
    filterIsActive: [],
    page: 1,
    pageSize: 20,
    sortBy: 'a.name_es_short',
    is_downloading: false,
  });
  const computedQueryKey = computed(() => ['security-companies-search', { search: queryPayload.value.searchString, sort: queryPayload.value.sortBy, filterActive: queryPayload.value.filterIsActive.join(',') }]);
  const computedRecordQueryKey = computed(() => ['security-companies-record', { id: selectedRecordId.value }]);
  const isFilterOpen = ref<boolean>(false);
  const isLoading = ref<boolean>(false);
  const selectedRecordId = ref<string>();
  const selectedRowData = ref<sys_companies>();
  const selectedRowDataAvatarHelper = ref<File | null>();
  // Constants (should be ref to make it work in Pinia)
  const sortItems = shallowRef([
    { id: 'a.name_es_short', label: 'Nombre' },
    { id: 'a.name_es', label: 'Razón Social' },
    { id: 'a.is_active', label: 'Estado' },
  ]);
  const filterActiveItems = shallowRef([
    { label: 'Organizaciones Activos', id: true, },
    { label: 'Organizaciones Inactivos', id: false, },
  ]);

  const hasFilter = computed<boolean>(() => queryPayload.value.searchString !== '' || queryPayload.value.filterIsActive?.length > 0);
  return {
    computedQueryKey,
    computedRecordQueryKey,
    filterActiveItems,
    hasFilter,
    isFilterOpen,
    isLoading,
    queryPayload,
    selectedRecordId,
    selectedRowData,
    selectedRowDataAvatarHelper,
    sortItems,
  };
});
