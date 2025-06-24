export const useBitacoraCarsStore = defineStore('bitacoraCars', () => {
  const queryPayload = ref<bitacora_cars_query>({
    search: undefined,
    sort: '1',
    order: 'asc',
    is_active: undefined,
  });
  const computedQueryKey = computed(() => 'bitacora-cars-search');
  const computedRecordQueryKey = computed(() => 'bitacora-cars-record');
  const selectedRowData = ref<bitacora_cars>();
  const userMenu = useState<sys_links[]>('userMenu');
  const canEdit = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_CARS_READ));
  const canCreate = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_CARS_CREATE));
  const canDownload = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_CARS_EXPORT));
  const isFormPanelCreating = computed<boolean>(() => Boolean(selectedRowData.value && selectedRowData.value.is_new));
  const formPanelTitle = computed<string>(() => isFormPanelCreating.value ? 'Nuevo vehículo' : 'Editar vehículo');
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
