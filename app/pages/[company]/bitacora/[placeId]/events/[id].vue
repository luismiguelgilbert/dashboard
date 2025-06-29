<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('lg');

const { currentRoute } = useRouter();
const headers = useRequestHeaders(['cookie']);
const userCompany = useState<sys_companies | undefined>('userCompany');
const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');
const queryClient = useQueryClient();
const store = useBitacoraEventsStore();
const {
  computedQueryKey,
  computedRecordQueryKey,
  selectedRowData,
  formPanelTitle,
  isSaveDisabled,
} = storeToRefs(store);

const { data, isFetching } = useQuery({
  queryKey: [computedRecordQueryKey.value, userCompany.value?.id, currentRoute.value.params.id],
  queryFn: () => $fetch(`/api/${userCompany.value?.id}/bitacora/${userBitaPlace.value?.id}/event`, { method: 'post', headers, body: { id: currentRoute.value.params.id } }),
  staleTime: 1000 * 60 * 5, // 5 minutes
});

const { mutateAsync, isPending } = useMutation({
  mutationFn: () => $fetch(`/api/${userCompany.value?.id}/bitacora/${userBitaPlace.value?.id}/event-upsert`, { method: 'POST', body: selectedRowData.value }),
  onSuccess: async () => {
    if (selectedRowData.value?.is_new) {
      queryClient.invalidateQueries({ queryKey: [computedQueryKey.value, userCompany.value?.id] });
    } else {
      // this optimisticly updates the cache data record to reflect changes in the list component
      queryClient.setQueriesData({ queryKey: [computedQueryKey.value] }, (cacheData: bitacora_events_query_cache | undefined) => {
        cacheData?.pages.forEach((page) => {
          const recordIndex = page.findIndex(event => event.id === selectedRowData.value?.id);
          if (page[recordIndex]) {
            page[recordIndex] = {
              ...page[recordIndex],
              // Update fields used in the list component
              comments: String(selectedRowData.value?.comments),
              event_at: String(selectedRowData.value?.event_at),
              is_critical: Boolean(selectedRowData.value?.is_critical),
            };
          }
        });
        return cacheData;
      })
    }
    await queryClient.invalidateQueries({ queryKey: [computedRecordQueryKey.value, userCompany.value?.id] });
  },
});

const saveForm = async () => {
  try {
    if (selectedRowData.value) {
      selectedRowData.value.is_saving = true;
      const { error } = bitacora_events_schema.safeParse(selectedRowData.value);
      if (error) throw error.issues.map(err => `- ${err.message}`).join('\n    ');
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
          @click="navigateTo({ name: 'company-bitacora-placeId-events', query: { ...useRoute().query } })" />
      </template>
      <template #right>
        <UButton
          icon="i-lucide-save"
          color="neutral"
          variant="solid"
          label="Guardar"
          class="-ms-1.5 cursor-pointer"
          :loading="isFetching || isPending"
          :disabled="isFetching || isPending || isSaveDisabled"
          @click="saveForm" />
      </template>
    </UDashboardNavbar>

    <UProgress v-if="isFetching" class="p-3" />
    <main v-if="!isFetching && selectedRowData">
      <EventFormContentBasic :vertical="isMobile" :disable="isFetching || isPending" />
      <EventFormContentAvatar :vertical="isMobile" :disable="isFetching || isPending" />
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
