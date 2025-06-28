<script setup lang="ts">
const props = defineProps<{
  disable: boolean;
  vertical?: boolean;
}>();

const moduleStore = useBitacoraEventsStore();
const { selectedRowData } = storeToRefs(moduleStore);
</script>

<template>
  <div
    v-if="selectedRowData"
    class="m-4 md:m-6">
    <UPageFeature
      title="Datos del evento"
      description="Información del evento" />
    <br>

    <UCard variant="subtle">
      <UForm
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="bitacora_events_schema">
        <UiDashboardSection
          :vertical="vertical"
          name="is_critical"
          label="Crítico?"
          hint="Marcar evento como crítico">
          <USwitch
            v-model="selectedRowData.is_critical"
            color="error"
            :label="selectedRowData.is_critical ? 'Crítico' : 'Normal'" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="name_es"
          label="Descripción"
          hint="Comentario sobre el evento">
        <UTextarea
            v-model="selectedRowData.comments"
            class="w-full"
            placeholder="Dirección de Facturación"
            icon="i-lucide-map-pin-house" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <br>
      </UForm>
    </UCard>
    <br>
  </div>
</template>
