<script setup lang="ts">
const { currentRoute } = useRouter();
const headers = useRequestHeaders(['cookie']);
const userCompany = useState<sys_companies | undefined>('userCompany');
const queryClient = useQueryClient();
const store = useBitacoraPlacesStore();
const {
  computedQueryKey,
  computedRecordQueryKey,
  selectedRowData,
  formPanelTitle,
  isSaveDisabled,
} = storeToRefs(store);

const { data, isFetching } = useQuery({
  queryKey: [computedRecordQueryKey.value, userCompany.value?.id, currentRoute.value.params.id],
  queryFn: () => $fetch(`/api/${userCompany.value?.id}/bitacora/place`, { method: 'post', headers, body: { id: currentRoute.value.params.id } }),
  staleTime: 1000 * 60 * 5, // 5 minutes
});

const { mutateAsync, isPending } = useMutation({
  mutationFn: () => $fetch(`/api/${userCompany.value?.id}/bitacora/place-upsert`, { method: 'POST', body: selectedRowData.value }),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: [computedRecordQueryKey.value, userCompany.value?.id] });
    // this optimisticly updates the cache data record to reflect changes in the list component
    queryClient.setQueriesData({ queryKey: [computedQueryKey.value] }, (cacheData: bitacora_places_query_cache | undefined) => {
      cacheData?.pages.forEach((page) => {
        const recordIndex = page.findIndex(place => place.id === selectedRowData.value?.id);
        if (page[recordIndex]) {
          page[recordIndex] = {
            ...page[recordIndex],
            // Update fields used in the list component
            name_es: String(selectedRowData.value?.name_es),
            name_es_short: String(selectedRowData.value?.name_es_short),
            is_active: Boolean(selectedRowData.value?.is_active),
          };
        }
      });
      return cacheData;
    })
  },
});

const saveForm = async () => {
  try {
    if (selectedRowData.value) {
      selectedRowData.value.is_saving = true;
      const { error } = bitacora_places_schema.safeParse(selectedRowData.value);
      if (error) throw error.issues.map(err => `- ${err.message}`).join('.\n    ');
      await mutateAsync();
      selectedRowData.value.is_saving = false;
      useToast().add({
        title: 'Datos guardados',
        icon: 'i-lucide-circle-check',
        color: 'success',
      });
    }
  } catch (error) {
    useToast().add({
      title: 'Error al guardar',
      description: `Revise sus datos y vuelva a intentarlo: \n ${error}`,
      icon: 'i-lucide-alert-triangle',
      color: 'error',
      ui: { description: 'text-sm text-muted whitespace-pre-line' }
    });
    console.error(error);
  }
};

// Keep useQuery props synced with Pinia store
watch(() => data.value, newData => selectedRowData.value = newData ? { ...newData } : undefined, { deep: true, immediate: true });
</script>

<template>
  <div class="wrapper">
    <UDashboardNavbar
      :title="formPanelTitle"
      :toggle="false">
      <template #leading>
        <UButton
          icon="i-lucide-circle-x"
          color="neutral"
          variant="ghost"
          class="-ms-1.5 cursor-pointer"
          @click="navigateTo({ name: 'company-bitacora-places', query: { ...useRoute().query } })" />
      </template>
      <template #right>
        <UButton
          icon="i-lucide-save"
          color="neutral"
          variant="solid"
          label="Guardar"
          class="-ms-1.5 cursor-pointer"
          :disabled="isFetching || isPending || isSaveDisabled"
          @click="saveForm" />
      </template>
    </UDashboardNavbar>

    <UProgress v-if="isFetching" class="p-3" />
    <main v-if="!isFetching && selectedRowData">
      <PlaceFormContentBasic :disable="isFetching" />
      <PlaceFormContentAvatar :disable="isFetching" />
    </main>
  </div>
</template>

<style scoped>
.wrapper {
  height: 100dvh;
  display: flex;
  flex-direction: column;
}
main {
  flex: 1;
  overflow-y: scroll;
}
</style>
