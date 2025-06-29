<script setup lang="ts">
import { DateTime } from 'luxon';

const props = defineProps<{
  disable: boolean;
  vertical?: boolean;
}>();

const moduleStore = useBitacoraEventsStore();
const { selectedRowData } = storeToRefs(moduleStore);

const updateEventAtDate = (newDate: string) => {
  if (selectedRowData.value?.event_at) {
    const modelDate = DateTime.fromSQL(selectedRowData.value.event_at).toISO()?.toString();
    const newModelDate = DateTime.fromFormat(`${newDate} ${modelDate?.slice(11, 16)}`, 'yyyy-MM-dd HH:mm');
    selectedRowData.value.event_at = newModelDate.toUTC().toFormat('yyyy-MM-dd HH:mm:ssZZ').slice(0, 22);
  }
};
const updateEventAtTime = (newTime: string) => {
  if (selectedRowData.value?.event_at) {
    const modelDate = DateTime.fromSQL(selectedRowData.value.event_at).toISO()?.toString();
    const newDate = `${modelDate?.slice(0, 10)}T${newTime}${modelDate?.slice(16, 29)}`;
    selectedRowData.value.event_at = DateTime.fromFormat(newDate, `yyyy-MM-dd'T'HH:mm:ss.SSSZZ`).toUTC().toFormat('yyyy-MM-dd HH:mm:ssZZ').slice(0, 22);
  }
};
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
            class="w-full"
            @value-changed="updateEventAtDate" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="name_es"
          label="Hora"
          hint="Hora del evento">
          <UiInputTime
            :initial-date="selectedRowData.event_at"
            class="w-full"
            @value-changed="updateEventAtTime" />
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
            placeholder="Describir evento"
            icon="i-lucide-notebook-pen" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          v-model="selectedRowData.responsible"
          name="responsible"
          label="Responsable"
          hint="Usuario que reporta">
          <UInput
            v-model="selectedRowData.responsible"
            disabled
            class="w-full"
            icon="i-lucide-user-round" />
        </UiDashboardSection>
        <br>
      </UForm>
    </UCard>
    <br>
  </div>
</template>
