export const useBitacoraPlacesStore = defineStore('bitacoraPlaces', () => {
  const queryPayload = ref<bitacora_places_query>({
    search: undefined,
    sort: '1',
    order: 'asc',
    is_active: undefined,
  });
  const computedQueryKey = computed(() => 'bitacora-places-search');
  const computedRecordQueryKey = computed(() => 'bitacora-places-record');
  const selectedRowData = ref<bitacora_places>();
  const userMenu = useState<sys_links[]>('userMenu');
  const canEdit = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_PLACES_READ));
  const canCreate = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_PLACES_CREATE));
  const canDownload = computed(() => userMenu.value.some(link => link.id === PermissionsList.BITACORA_PLACES_EXPORT));
  const isFormPanelCreating = computed<boolean>(() => Boolean(selectedRowData.value && selectedRowData.value.is_new));
  const formPanelTitle = computed<string>(() => isFormPanelCreating.value ? 'Nuevo punto de control' : 'Editar punto de control');
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
