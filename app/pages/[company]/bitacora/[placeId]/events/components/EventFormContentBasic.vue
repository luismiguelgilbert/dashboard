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
          label="Fecha"
          hint="Fecha del evento">
          <UiInputDate
            :initial-date="selectedRowData.event_at"
            class="w-full" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="name_es"
          label="Hora"
          hint="Hora del evento">
          <UiInputTime
            :initial-date="selectedRowData.event_at"
            class="w-full" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          labelTop
          name="name_es"
          label="Descripción"
          hint="Comentario sobre el evento">
        <UTextarea
            v-model="selectedRowData.comments"
            class="w-full"
            placeholder="Dirección de Facturación"
            icon="i-lucide-notebook-pen" />
        </UiDashboardSection>
        <br>
      </UForm>
    </UCard>
    <br>
  </div>
</template>
