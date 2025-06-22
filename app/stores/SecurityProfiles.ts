export const useSecurityProfilesStore = defineStore('securityProfiles', () => {
  const queryPayload = ref<sys_profiles_query>({
    search: undefined,
    sort: '1',
    order: 'asc',
    is_active: undefined,
  });
  const computedQueryKey = computed(() => 'security-profiles-search');
  const computedRecordQueryKey = computed(() => 'security-profiles-record');
  const selectedRowData = ref<sys_profiles>();
  const userMenu = useState<sys_links[]>('userMenu');
  const canEdit = computed(() => userMenu.value.some(link => link.id === PermissionsList.ROLES_EDIT));
  const canCreate = computed(() => userMenu.value.some(link => link.id === PermissionsList.ROLES_CREATE));
  const canDownload = computed(() => userMenu.value.some(link => link.id === PermissionsList.ROLES_EXPORT));
  const isFormPanelCreating = computed<boolean>(() => Boolean(selectedRowData.value && selectedRowData.value.is_new));
  const formPanelTitle = computed<string>(() => isFormPanelCreating.value ? 'Nuevo perfil' : 'Editar perfil');
  const isSaveDisabled = computed<boolean>(() => (isFormPanelCreating.value && !canCreate) || (!isFormPanelCreating.value && !canEdit));// pending
  const hasFilter = computed<boolean>(() => (queryPayload.value.search && queryPayload.value.search.trim().length > 0)
    || Boolean(queryPayload.value.is_active?.length && queryPayload.value.is_active.length > 0)
  );

  return {
    computedQueryKey,
    computedRecordQueryKey,
    hasFilter,
    queryPayload,
    selectedRowData,
    formPanelTitle,
    isFormPanelCreating,
    isSaveDisabled,
    canEdit,
    canCreate,
    canDownload,
  };
});
