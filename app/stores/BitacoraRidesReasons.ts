export const useBitacoraRidesReasonsStore = defineStore('bitacoraRidesReasons', () => {
  const queryPayload = ref<bitacora_rides_reasons_query>({
    search: undefined,
    sort: '1',
    order: 'asc',
    is_active: undefined,
  });
  const computedQueryKey = computed(() => 'bitacora-rides_reasons-search');
  const computedRecordQueryKey = computed(() => 'bitacora-rides_reasons-record');
  const selectedRowData = ref<bitacora_rides_reasons>();
  const userMenu = useState<sys_links[]>('userMenu');
  const canEdit = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_RIDES_REASONS_READ));
  const canCreate = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_RIDES_REASONS_CREATE));
  const canDownload = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_RIDES_REASONS_EXPORT));
  const isFormPanelCreating = computed<boolean>(() => Boolean(selectedRowData.value && selectedRowData.value.is_new));
  const formPanelTitle = computed<string>(() => isFormPanelCreating.value ? 'Nuevo motivo' : 'Editar motivo');
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
