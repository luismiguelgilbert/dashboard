export const useBitacoraEventsStore = defineStore('bitacoraEvents', () => {
  const queryPayload = ref<bitacora_events_query>({
    search: undefined,
    sort: '1',
    order: 'desc',
    is_active: undefined,
    is_critical: undefined,
  });
  const computedQueryKey = computed(() => 'bitacora-events-search');
  const computedRecordQueryKey = computed(() => 'bitacora-events-record');
  const selectedRowData = ref<bitacora_events>();
  const userMenu = useState<sys_links[]>('userMenu');
  const canEdit = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_EVENTS_READ));
  const canCreate = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_EVENTS_CREATE));
  const canDownload = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_EVENTS_EXPORT));
  const isFormPanelCreating = computed<boolean>(() => Boolean(selectedRowData.value && selectedRowData.value.is_new));
  const formPanelTitle = computed<string>(() => isFormPanelCreating.value ? 'Nuevo evento' : 'Editar evento');
  const isSaveDisabled = computed<boolean>(() => (isFormPanelCreating.value && !canCreate.value) || (!isFormPanelCreating.value && !canEdit.value));
  const hasFilter = computed<boolean>(() => (queryPayload.value.search && queryPayload.value.search.trim().length > 0)
    || Boolean(queryPayload.value.is_active?.length && queryPayload.value.is_active.length > 0)
    || Boolean(queryPayload.value.is_critical?.length && queryPayload.value.is_critical.length > 0)
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
