export const useSecurityUsersStore = defineStore('securityUsers', () => {
  const queryPayload = ref<sys_users_query>({
    searchString: '',
    filterIsActive: [],
    filterProfile: [],
    filterSex: [],
    pageSize: 20,
    sortBy: 'a.user_name',
    is_downloading: false,
  });
  const keyRef = ref(1);
  const computedQueryKey = computed(() => ['security-users-search', { search: queryPayload.value.searchString, sort: queryPayload.value.sortBy, filterActive: queryPayload.value.filterIsActive.join(','), filterProfile: queryPayload.value.filterProfile.join(','), filterSex: queryPayload.value.filterSex.join(',') }]);
  const computedQueryKeyRef = computed(() => `${computedQueryKey.value[0]}-${JSON.stringify(computedQueryKey.value[1])}-${keyRef.value}`);
  const computedRecordQueryKey = computed(() => ['security-users-record', { id: selectedRecordId.value }]);
  const isLoading = ref<boolean>(false);
  const selectedRecordId = ref<string>();
  const selectedRowData = ref<sys_users>();
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
    computedQueryKeyRef,
    computedRecordQueryKey,
    filterActiveItems,
    filterSexItems,
    hasFilter,
    isLoading,
    keyRef,
    queryPayload,
    selectedRecordId,
    selectedRowData,
    sortItems,
  };
});
