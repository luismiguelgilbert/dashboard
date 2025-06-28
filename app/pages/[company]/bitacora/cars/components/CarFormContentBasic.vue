<script setup lang="ts">
const props = defineProps<{
  disable: boolean;
  vertical?: boolean;
}>();

const moduleStore = useBitacoraCarsStore();
const { selectedRowData } = storeToRefs(moduleStore);
</script>

<template>
  <div
    v-if="selectedRowData"
    class="m-4 md:m-6">
    <UPageFeature
      title="Datos del Vehículo"
      description="Datos básicos del vehículo" />
    <br>

    <UCard variant="subtle">
      <UForm
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="bitacora_cars_schema">
        <UiDashboardSection
          :vertical="vertical"
          name="is_active"
          label="Estado"
          hint="Activar/Inactivar vehículo">
          <USwitch
            v-model="selectedRowData.is_active"
            :label="selectedRowData.is_active ? 'Activo' : 'Inactivo'" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="name_es"
          label="Nombre del vehículo"
          hint="Nombre descriptivo del vehículo">
          <UInput
            v-model="selectedRowData.name_es"
            class="w-full"
            placeholder="Nombre descriptivo del vehículo"
            icon="i-lucide-car" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="name_es_short"
          label="Código del vehículo"
          hint="Código del vehículo">
          <UInput
            v-model="selectedRowData.name_es_short"
            class="w-full"
            placeholder="Código del vehículo"
            icon="i-lucide-car-front" />
        </UiDashboardSection>
        <br>
      </UForm>
    </UCard>
    <br>
  </div>
</template>
