<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('lg');

const { currentRoute } = useRouter();
const headers = useRequestHeaders(['cookie']);
const userCompany = useState<sys_companies | undefined>('userCompany');
const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');
const queryClient = useQueryClient();
const store = useBitacoraVisitsStore();
const {
  computedQueryKey,
  computedRecordQueryKey,
  formPanelTitle,
  isFormPanelCreating,
  isSaveDisabled,
  selectedRowData,
} = storeToRefs(store);
const selectedTab = ref<'input' | 'output'>('input');
const tabs = computed<TabsItem[]>(() => [
  { value: 'input', label: 'Ingreso', disabled: false },
  { value: 'output', label: 'Salida', disabled: isFormPanelCreating.value },
]);

const { data, isFetching } = useQuery({
  queryKey: [computedRecordQueryKey.value, userCompany.value?.id, currentRoute.value.params.id],
  queryFn: () => $fetch(`/api/${userCompany.value?.id}/bitacora/${userBitaPlace.value?.id}/visit`, { method: 'post', headers, body: { id: currentRoute.value.params.id } }),
  staleTime: 1000 * 60 * 5, // 5 minutes
});

const { mutateAsync, isPending } = useMutation({
  mutationFn: () => $fetch(`/api/${userCompany.value?.id}/bitacora/${userBitaPlace.value?.id}/visit-upsert`, { method: 'POST', body: selectedRowData.value }),
  onSuccess: async () => {
    queryClient.invalidateQueries({ queryKey: [computedQueryKey.value, userCompany.value?.id, userBitaPlace.value?.id] });
    await queryClient.invalidateQueries({ queryKey: [computedRecordQueryKey.value, userCompany.value?.id] });
    navigateTo({ name: 'company-bitacora-placeId-visits', query: { ...useRoute().query } });
  },
});

const saveForm = async () => {
  try {
    if (selectedRowData.value) {
      selectedRowData.value.is_saving = true;
      const { error } = bitacora_visits_schema.safeParse(selectedRowData.value);
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
          @click="navigateTo({ name: 'company-bitacora-placeId-visits', query: { ...useRoute().query } })" />
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

    <header>
      <UProgress v-if="isFetching" class="p-3" />
      <UTabs
        v-if="!isFetching"
        v-model="selectedTab"
        :unmount-on-hide="false"
        :items="tabs"
        :size="isMobile ? 'xs' : 'lg'"
        color="neutral"
        variant="pill"
        class="w-full mt-1.5 ml-2 pr-4" />
      <USeparator />
    </header>

    <main v-if="!isFetching && selectedRowData">
      <template v-if="selectedTab === 'input'">
        <VisitFormContentBasic :vertical="isMobile" :disable="isFetching || isPending" />
        <VisitFormContentAvatar :vertical="isMobile" :disable="isFetching || isPending" />
      </template>
      <template v-if="selectedTab === 'output'">
        <VisitFormContentExit :vertical="isMobile" :disable="isFetching || isPending" />
      </template>
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
