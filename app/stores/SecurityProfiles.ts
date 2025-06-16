export const useSecurityProfilesStore = defineStore('securityProfiles', () => {
  const queryPayload = ref<sys_profiles_query>({
    searchString: '',
    filterIsActive: [],
    pageSize: 20,
    sortBy: 'a.name_es',
    sortByOrder: 'asc',
    is_downloading: false,
  });
  const computedQueryKey = computed(() => ['security-profiles-search', { search: queryPayload.value.searchString, sort: queryPayload.value.sortBy, sortOrder: queryPayload.value.sortByOrder, filterActive: queryPayload.value.filterIsActive.join(',') }]);
  const computedRecordQueryKey = computed(() => ['security-profiles-record', { id: selectedRecordId.value }]);
  const isLoading = ref<boolean>(false);
  const selectedRecordId = ref<string>();
  const selectedRowData = ref<sys_profiles>();
  const userMenu = useState<sys_links[]>('userMenu');
  const canEdit = computed(() => userMenu.value.some(link => link.id === PermissionsList.ROLES_EDIT));
  const canCreate = computed(() => userMenu.value.some(link => link.id === PermissionsList.ROLES_CREATE));
  const canDownload = computed(() => userMenu.value.some(link => link.id === PermissionsList.ROLES_EXPORT));
  const isFormPanelCreating = computed<boolean>(() => !!useRoute().query.is_new);
  const formPanelTitle = computed<string>(() => isFormPanelCreating.value ? 'Nuevo perfil' : 'Editar perfil');
  const isSaveDisabled = computed<boolean>(() => isLoading.value || (isFormPanelCreating.value && !canCreate) || (!isFormPanelCreating.value && !canEdit));
  // Constants (should be ref to make it work in Pinia)
  const sortItems = shallowRef([
    { id: 'a.name_es', label: 'Nombre' },
    { id: 'a.is_active', label: 'Estado' },
  ]);
  const filterActiveItems = shallowRef([
    { label: 'Perfiles Activos', id: 'true', },
    { label: 'Perfiles Inactivos', id: 'false', },
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
