export const useSecurityUsersStore = defineStore('securityUsers', () => {
  const queryPayload = ref<sys_users_query>({
    searchString: '',
    filterIsActive: [],
    filterProfile: [],
    filterSex: [],
    page: 1,
    pageSize: 20,
    sortBy: 'a.user_name',
    is_downloading: false,
  });
  const computedQueryKey = computed(() => `users-search:${queryPayload.value.searchString}-sort:${queryPayload.value.sortBy}-filterActive:${queryPayload.value.filterIsActive.join(',')}-filterSex:${queryPayload.value.filterSex.join(',')}`);
  const isLoading = ref<boolean>(false);
  const isFilterOpen = ref<boolean>(false);
  const selectedRecordId = ref<string>();
  const selectedRowData = ref<sys_users>(sys_users_schema.parse({}));
  const selectedRowDataAvatarHelper = ref<File | null>();
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
    { label: 'Usuarios Activos', id: true, },
    { label: 'Usuarios Inactivos', id: false, },
  ]);
  const filterSexItems = shallowRef([
    { label: 'Hombres', id: true, },
    { label: 'Mujeres', id: false, },
  ]);

  const hasFilter = computed<boolean>(() => queryPayload.value.searchString !== '' || queryPayload.value.filterIsActive?.length > 0 || queryPayload.value.filterProfile?.length > 0 || queryPayload.value.filterSex?.length > 0);
  return {
    computedQueryKey,
    filterActiveItems,
    filterSexItems,
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
