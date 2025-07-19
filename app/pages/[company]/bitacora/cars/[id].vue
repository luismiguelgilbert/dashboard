<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('lg');

const store = useBitacoraCarsStore();
const { selectedRowData, formPanelTitle, isSaveDisabled } = storeToRefs(store);
const { dataRecord, dataRecordFetching, dataRecordUpdate, dataRecordUpdating } = useBitacoraCarsQueries();

const saveForm = async () => {
  try {
    if (selectedRowData.value) {
      selectedRowData.value.is_saving = true;
      const { error } = bitacora_cars_schema.safeParse(selectedRowData.value);
      if (error) throw error.issues.map(err => `- ${err.message}`).join('\n    ');
      await dataRecordUpdate(selectedRowData.value);
      useToast().add({ title: 'Datos guardados', icon: 'i-lucide-circle-check', color: 'success' });
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
          @click="navigateTo({ name: 'company-bitacora-cars', query: { ...useRoute().query } })" />
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

    <UProgress v-if="dataRecordFetching" class="p-3" />
    <main v-if="!dataRecordFetching && selectedRowData">
      <CarFormContentBasic :vertical="isMobile" :disable="dataRecordFetching || dataRecordUpdating" />
      <CarFormContentAvatar :vertical="isMobile" :disable="dataRecordFetching || dataRecordUpdating" />
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
