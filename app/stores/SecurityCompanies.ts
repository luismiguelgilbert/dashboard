export const useSecurityCompaniesStore = defineStore('securityCompanies', () => {
  const queryPayload = ref<sys_companies_query>({
    search: undefined,
    sort: '1',
    order: 'asc',
    is_active: undefined,
  });
  const computedQueryKey = computed(() => 'security-companies-search');
  const computedRecordQueryKey = computed(() => 'security-companies-record');
  const selectedRowData = ref<sys_companies>();
  const userMenu = useState<sys_links[]>('userMenu');
  const canEdit = computed(() => userMenu.value.some(link => link.id === PermissionsList.COMPANIES_EDIT));
  const canCreate = computed(() => userMenu.value.some(link => link.id === PermissionsList.COMPANIES_CREATE));
  const canDownload = computed(() => userMenu.value.some(link => link.id === PermissionsList.COMPANIES_EXPORT));
  const isFormPanelCreating = computed<boolean>(() => Boolean(selectedRowData.value && selectedRowData.value.is_new));
  const formPanelTitle = computed<string>(() => isFormPanelCreating.value ? 'Nuevo organización' : 'Editar organización');
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
