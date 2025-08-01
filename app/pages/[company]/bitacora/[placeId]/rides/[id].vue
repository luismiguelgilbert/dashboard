<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('lg');

const store = useBitacoraRidesStore();
const { selectedRowData, formPanelTitle, isSaveDisabled } = storeToRefs(store);
const { dataRecord, dataRecordFetching, dataRecordUpdate, dataRecordUpdating } = useBitacoraRidesQueries();
const selectedTab = ref<'input' | 'output'>('output');
const tabs = computed<TabsItem[]>(() => [
  { value: 'output', label: 'Salida', disabled: false },
  { value: 'input', label: 'Retorno', disabled: selectedRowData.value?.is_new },
]);

const saveForm = async () => {
  try {
    if (selectedRowData.value) {
      const shouldNavigateBacktoList = selectedRowData.value.is_complete;
      selectedRowData.value.is_saving = true;
      const { error } = bitacora_rides_schema.safeParse(selectedRowData.value);
      if (error) throw error.issues.map(err => `- ${err.message}`).join('\n    ');
      await dataRecordUpdate(selectedRowData.value);
      useToast().add({ title: 'Datos guardados', icon: 'i-lucide-circle-check', color: 'success' });
      if (shouldNavigateBacktoList) {
        navigateTo({ name: 'company-bitacora-placeId-rides', query: { ...useRoute().query } })
      }
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
watch(() => dataRecord.value, newData => selectedRowData.value = newData ? { ...newData } : undefined, { deep: true, immediate: true });
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
          @click="navigateTo({ name: 'company-bitacora-placeId-rides', query: { ...useRoute().query } })" />
      </template>
      <template #right>
        <UButton
          icon="i-lucide-save"
          color="neutral"
          variant="solid"
          label="Guardar"
          class="-ms-1.5 cursor-pointer"
          :loading="dataRecordFetching || dataRecordUpdating"
          :disabled="dataRecordFetching || dataRecordUpdating || isSaveDisabled"
          @click="saveForm" />
      </template>
    </UDashboardNavbar>

    <header>
      <UProgress v-if="dataRecordFetching" class="p-3" />
      <UTabs
        v-if="!dataRecordFetching"
        v-model="selectedTab"
        :unmount-on-hide="false"
        :items="tabs"
        :size="isMobile ? 'xs' : 'lg'"
        color="neutral"
        variant="pill"
        class="w-full mt-1.5 ml-2 pr-4" />
      <USeparator />
    </header>

    <main v-if="!dataRecordFetching && selectedRowData">
      <template v-if="selectedTab === 'output'">
        <RideFormContentBasic :vertical="isMobile" :disable="dataRecordFetching || dataRecordUpdating" />
      </template>
      <template v-if="selectedTab === 'input'">
        <RideFormContentReturn :vertical="isMobile" :disable="dataRecordFetching || dataRecordUpdating" />
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
