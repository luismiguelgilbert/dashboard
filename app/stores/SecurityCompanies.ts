export const useSecurityCompaniesStore = defineStore('securityCompanies', () => {
  const queryPayload = ref<sys_companies_query>({
    searchString: '',
    filterIsActive: [],
    pageSize: 20,
    sortBy: 'a.name_es_short',
    sortByOrder: 'asc',
    is_downloading: false,
  });
  const computedQueryKey = computed(() => ['security-companies-search', { search: queryPayload.value.searchString, sort: queryPayload.value.sortBy, sortOrder: queryPayload.value.sortByOrder, filterActive: queryPayload.value.filterIsActive.join(',') }]);
  const computedRecordQueryKey = computed(() => ['security-companies-record', { id: selectedRecordId.value }]);
  const isLoading = ref<boolean>(false);
  const selectedRecordId = ref<string>();
  const selectedRowData = ref<sys_companies>();
  const userMenu = useState<sys_links[]>('userMenu');
  const canEdit = computed(() => userMenu.value.some(link => link.id === PermissionsList.COMPANIES_EDIT));
  const canCreate = computed(() => userMenu.value.some(link => link.id === PermissionsList.COMPANIES_CREATE));
  const canDownload = computed(() => userMenu.value.some(link => link.id === PermissionsList.COMPANIES_EXPORT));
  const isFormPanelCreating = computed<boolean>(() => !!useRoute().query.is_new);
  const formPanelTitle = computed<string>(() => isFormPanelCreating.value ? 'Nueva organización' : 'Editar organización');
  const isSaveDisabled = computed<boolean>(() => isLoading.value || (isFormPanelCreating.value && !canCreate) || (!isFormPanelCreating.value && !canEdit));
  // Constants (should be ref to make it work in Pinia)
  const sortItems = shallowRef([
    { id: 'a.name_es_short', label: 'Nombre' },
    { id: 'a.name_es', label: 'Razón Social' },
    { id: 'a.is_active', label: 'Estado' },
  ]);
  const filterActiveItems = shallowRef([
    { label: 'Organizaciones Activos', id: 'true', },
    { label: 'Organizaciones Inactivos', id: 'false', },
  ]);

  const hasFilter = computed<boolean>(() => queryPayload.value.searchString !== '' || queryPayload.value.filterIsActive?.length > 0);
  return {
    computedQueryKey,
    computedRecordQueryKey,
    filterActiveItems,
    hasFilter,
    isLoading,
    queryPayload,
    selectedRecordId,
    selectedRowData,
    sortItems,
    formPanelTitle,
    isFormPanelCreating,
    isSaveDisabled,
    canEdit,
    canCreate,
    canDownload,
  };
});
