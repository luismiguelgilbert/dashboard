<script setup lang="ts">
const props = defineProps<{
  disable: boolean;
  vertical?: boolean;
}>();

const moduleStore = useBitacoraReasonsStore();
const { selectedRowData } = storeToRefs(moduleStore);
</script>

<template>
  <div
    v-if="selectedRowData"
    class="m-4 md:m-6">
    <UPageFeature
      title="Datos del Motivo"
      description="Datos básicos del motivo" />
    <br>

    <UCard variant="subtle">
      <UForm
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="bitacora_reasons_schema">
        <UiDashboardSection
          :vertical="vertical"
          name="is_active"
          label="Estado"
          hint="Activar/Inactivar motivo">
          <USwitch
            v-model="selectedRowData.is_active"
            :label="selectedRowData.is_active ? 'Activo' : 'Inactivo'" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="name_es"
          label="Nombre del motivo"
          hint="Descripción del motivo">
          <UInput
            v-model="selectedRowData.name_es"
            class="w-full"
            placeholder="Descripción del motivo"
            icon="i-lucide-list-check" />
        </UiDashboardSection>
        <br>
      </UForm>
    </UCard>
    <br>
  </div>
</template>
