<script setup lang="ts">
import { DateTime } from 'luxon';

const props = defineProps<{
  disable: boolean;
  vertical?: boolean;
}>();

const moduleStore = useBitacoraRidesStore();
const { selectedRowData } = storeToRefs(moduleStore);
const updateRideEndDate = (newDate: string) => {
  if (selectedRowData.value?.ride_end) {
    const modelDate = DateTime.fromSQL(selectedRowData.value.ride_end).toISO()?.toString();
    const newModelDate = DateTime.fromFormat(`${newDate} ${modelDate?.slice(11, 16)}`, 'yyyy-MM-dd HH:mm');
    selectedRowData.value.ride_end = newModelDate.toUTC().toFormat('yyyy-MM-dd HH:mm:ssZZ').slice(0, 22);
  }
};
const updateRideEndTime = (newTime: string) => {
  if (selectedRowData.value?.ride_end) {
    const modelDate = DateTime.fromSQL(selectedRowData.value.ride_end).toISO()?.toString();
    const newDate = `${modelDate?.slice(0, 10)}T${newTime}${modelDate?.slice(16, 29)}`;
    selectedRowData.value.ride_end = DateTime.fromFormat(newDate, `yyyy-MM-dd'T'HH:mm:ss.SSSZZ`).toUTC().toFormat('yyyy-MM-dd HH:mm:ssZZ').slice(0, 22);
  }
};
</script>

<template>
  <div
    v-if="selectedRowData"
    class="m-4 md:m-6">
    <UPageFeature
      title="Completar Viaje"
      description="Información al regreso" />
    <br>

    <UCard variant="subtle">
      <UForm
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="bitacora_visits_schema">
        <UiDashboardSection
          :vertical="vertical"
          name="ride_end"
          label="Fin de viaje"
          hint="Fecha de regreso">
          <UiInputDate
            v-if="selectedRowData.ride_end"
            :initial-date="selectedRowData.ride_end"
            class="w-full"
            @value-changed="updateRideEndDate" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="ride_end"
          label="Fin de viaje"
          hint="Hora de regreso">
          <UiInputTime
            v-if="selectedRowData.ride_end"
            :initial-date="selectedRowData.ride_end"
            class="w-full"
            @value-changed="updateRideEndTime" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="ride_end_km"
          label="Fin de viaje"
          hint="Kilometraje al regreso">
          <UInputNumber
            v-model="selectedRowData.ride_end_km"
            class="w-full"
            orientation="vertical" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          labelTop
          name="ride_end_comment"
          label="Comentario"
          hint="Comentario al regresar">
        <UTextarea
            v-model="selectedRowData.ride_end_comment"
            class="w-full"
            placeholder="Comentario al regresar"
            icon="i-lucide-notebook-pen" />
        </UiDashboardSection>
      </UForm>
    </UCard>
    <br>
  </div>
</template>
