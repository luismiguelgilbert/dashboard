export const useSecurityUsersStore = defineStore('securityUsers', () => {
  const queryPayload = ref<sys_users_query>({
    search: undefined,
    sort: '1',
    order: 'asc',
    is_active: undefined,
    user_sex: undefined,
  });
  const computedQueryKey = computed(() => 'security-users-search');
  const computedRecordQueryKey = computed(() => 'security-users-record');
  const selectedRowData = ref<sys_users>();
  const userMenu = useState<sys_links[]>('userMenu');
  const canEdit = computed(() => userMenu.value.some(link => link.id === PermissionsList.USERS_EDIT));
  const canCreate = computed(() => userMenu.value.some(link => link.id === PermissionsList.USERS_CREATE));
  const canDownload = computed(() => userMenu.value.some(link => link.id === PermissionsList.USERS_EXPORT));
  const isFormPanelCreating = computed<boolean>(() => Boolean(selectedRowData.value && selectedRowData.value.is_new));
  const formPanelTitle = computed<string>(() => isFormPanelCreating.value ? 'Nuevo usuario' : 'Editar usuario');
  const isSaveDisabled = computed<boolean>(() => (isFormPanelCreating.value && !canCreate) || (!isFormPanelCreating.value && !canEdit));// pending
  const hasFilter = computed<boolean>(() => (queryPayload.value.search && queryPayload.value.search.trim().length > 0)
    || Boolean(queryPayload.value.is_active?.length && queryPayload.value.is_active.length > 0)
    || Boolean(queryPayload.value.user_sex?.length && queryPayload.value.user_sex?.length > 0)
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
