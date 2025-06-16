export const useSecurityUsersStore = defineStore('securityUsers', () => {
  const queryPayload = ref<sys_users_query>({
    searchString: '',
    filterIsActive: [],
    filterProfile: [],
    filterSex: [],
    pageSize: 20,
    sortBy: 'a.user_name',
    sortByOrder: 'asc',
    is_downloading: false,
  });
  const computedQueryKey = computed(() => ['security-users-search', { search: queryPayload.value.searchString, sort: queryPayload.value.sortBy, sortOrder: queryPayload.value.sortByOrder, filterActive: queryPayload.value.filterIsActive.join(','), filterProfile: queryPayload.value.filterProfile.join(','), filterSex: queryPayload.value.filterSex.join(',') }]);
  const computedRecordQueryKey = computed(() => ['security-users-record', { id: selectedRecordId.value }]);
  const isLoading = ref<boolean>(false);
  const selectedRecordId = ref<string>();
  const selectedRowData = ref<sys_users>();
  const userMenu = useState<sys_links[]>('userMenu');
  const canEdit = computed(() => userMenu.value.some(link => link.id === PermissionsList.USERS_EDIT));
  const canCreate = computed(() => userMenu.value.some(link => link.id === PermissionsList.USERS_CREATE));
  const canDownload = computed(() => userMenu.value.some(link => link.id === PermissionsList.USERS_EXPORT));
  const isFormPanelCreating = computed<boolean>(() => !!useRoute().query.is_new);
  const formPanelTitle = computed<string>(() => isFormPanelCreating.value ? 'Nuevo usuario' : 'Editar usuario');
  const isSaveDisabled = computed<boolean>(() => isLoading.value || (isFormPanelCreating.value && !canCreate) || (!isFormPanelCreating.value && !canEdit));
  // Constants (should be ref to make it work in Pinia)
  const sortItems = shallowRef([
    { id: 'a.user_name', label: 'Nombres' },
    { id: 'a.user_lastname', label: 'Apellidos' },
    { id: 'a.is_active', label: 'Estado' },
    { id: 'a.email', label: 'Email' },
    { id: 'a.user_sex', label: 'Sexo' },
    { id: 'b.name_es', label: 'Perfil' },
  ]);
  const filterActiveItems = shallowRef([
    { label: 'Usuarios Activos', id: 'true', },
    { label: 'Usuarios Inactivos', id: 'false', },
  ]);
  const filterSexItems = shallowRef([
    { label: 'Hombres', id: 'true', },
    { label: 'Mujeres', id: 'false', },
  ]);

  const hasFilter = computed<boolean>(() => queryPayload.value.searchString !== '' || queryPayload.value.filterIsActive?.length > 0 || queryPayload.value.filterProfile?.length > 0 || queryPayload.value.filterSex?.length > 0);
  return {
    computedQueryKey,
    computedRecordQueryKey,
    filterActiveItems,
    filterSexItems,
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
