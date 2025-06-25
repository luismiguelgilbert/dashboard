<script setup lang="ts">
const props = defineProps<{
  disable: boolean;
}>();

const moduleStore = useBitacoraPlacesStore();
const { selectedRowData } = storeToRefs(moduleStore);
</script>

<template>
  <div
    v-if="selectedRowData"
    class="m-4 md:m-6">
    <UPageFeature
      title="Datos del punto de control"
      description="Datos básicos del punto de control" />
    <br>

    <UCard variant="subtle">
      <UForm
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="bitacora_places_schema">
        <UiDashboardSection
          name="is_active"
          label="Estado"
          hint="Activar/Inactivar punto de control">
          <USwitch
            v-model="selectedRowData.is_active"
            :label="selectedRowData.is_active ? 'Activo' : 'Inactivo'" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          name="name_es"
          label="Nombre del punto de control"
          hint="Nombre descriptivo del punto de control">
          <UInput
            v-model="selectedRowData.name_es"
            class="w-full"
            placeholder="Nombre descriptivo del punto de control"
            icon="i-lucide-map-pinned" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          name="name_es_short"
          label="Código del punto de control"
          hint="Código del punto de control">
          <UInput
            v-model="selectedRowData.name_es_short"
            class="w-full"
            placeholder="Código del punto de control"
            icon="i-lucide-map" />
        </UiDashboardSection>
        <br>
      </UForm>
    </UCard>
    <br>
  </div>
</template>
