export const useBitacoraVisitsStore = defineStore('bitacoraVisits', () => {
  const queryPayload = ref<bitacora_visits_query>({
    search: undefined,
    sort: '1',
    order: 'desc',
    is_active: ['True'],
  });
  const computedQueryKey = computed(() => 'bitacora-visits-search');
  const computedRecordQueryKey = computed(() => 'bitacora-visits-record');
  const selectedRowData = ref<bitacora_visits>();
  const userMenu = useState<sys_links[]>('userMenu');
  const canEdit = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_VISITS_READ));
  const canCreate = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_VISITS_CREATE));
  const canDownload = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_VISITS_EXPORT));
  const isFormPanelCreating = computed<boolean>(() => Boolean(selectedRowData.value && selectedRowData.value.is_new));
  const formPanelTitle = computed<string>(() => isFormPanelCreating.value ? 'Nueva visita' : 'Editar visita');
  const isSaveDisabled = computed<boolean>(() => (isFormPanelCreating.value && !canCreate) || (!isFormPanelCreating.value && !canEdit));// pending
  const hasFilter = computed<boolean>(() => Boolean(queryPayload.value.search && queryPayload.value.search.trim().length > 0));

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
