export const useBitacoraRidesStore = defineStore('bitacoraRides', () => {
  const queryPayload = ref<bitacora_rides_query>({
    search: undefined,
    sort: '1',
    order: 'desc',
    is_active: undefined,
  });
  const computedQueryKey = computed(() => 'bitacora-rides-search');
  const computedRecordQueryKey = computed(() => 'bitacora-rides-record');
  const selectedRowData = ref<bitacora_rides>();
  const userMenu = useState<sys_links[]>('userMenu');
  const canEdit = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_RIDES_READ));
  const canCreate = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_RIDES_CREATE));
  const canDownload = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_RIDES_EXPORT));
  const isFormPanelCreating = computed<boolean>(() => Boolean(selectedRowData.value && selectedRowData.value.is_new));
  const formPanelTitle = computed<string>(() => isFormPanelCreating.value ? 'Nuevo viaje' : 'Editar viaje');
  const isSaveDisabled = computed<boolean>(() => (isFormPanelCreating.value && !canCreate.value) || (!isFormPanelCreating.value && !canEdit.value));
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
