<script setup lang="ts">
import { DateTime } from 'luxon';

const props = defineProps<{
  disable: boolean;
  vertical?: boolean;
}>();

const moduleStore = useBitacoraVisitsStore();
const { selectedRowData } = storeToRefs(moduleStore);
const updateVisitEndDate = (newDate: string) => {
  if (selectedRowData.value?.visit_end) {
    const modelDate = DateTime.fromSQL(selectedRowData.value.visit_end).toISO()?.toString();
    const newModelDate = DateTime.fromFormat(`${newDate} ${modelDate?.slice(11, 16)}`, 'yyyy-MM-dd HH:mm');
    selectedRowData.value.visit_end = newModelDate.toUTC().toFormat('yyyy-MM-dd HH:mm:ssZZ').slice(0, 22);
  }
};
const updateVisitEndTime = (newTime: string) => {
  if (selectedRowData.value?.visit_end) {
    const modelDate = DateTime.fromSQL(selectedRowData.value.visit_end).toISO()?.toString();
    const newDate = `${modelDate?.slice(0, 10)}T${newTime}${modelDate?.slice(16, 29)}`;
    selectedRowData.value.visit_end = DateTime.fromFormat(newDate, `yyyy-MM-dd'T'HH:mm:ss.SSSZZ`).toUTC().toFormat('yyyy-MM-dd HH:mm:ssZZ').slice(0, 22);
  }
};

const resetVisitEnd = () => {
  if (selectedRowData.value) {
    if (!selectedRowData.value?.is_complete) {
      selectedRowData.value.visit_end = null;
    } else {
      selectedRowData.value.visit_end = DateTime.now().toUTC().toFormat('yyyy-MM-dd HH:mm:ssZZ').slice(0, 22);
    }
  }
};
</script>

<template>
  <div
    v-if="selectedRowData"
    class="m-4 md:m-6">
    <UPageFeature
      title="Completar la Visita"
      description="Registrar salida del visitante" />
    <br>

    <UCard variant="subtle">
      <UForm
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="bitacora_visits_schema">
        <UiDashboardSection
          :vertical="vertical"
          name="is_complete"
          label="Visita Completa?"
          hint="Completar visita">
          <USwitch
            v-model="selectedRowData.is_complete"
            :label="selectedRowData.is_complete ? 'Sí' : 'No'"
            @update:model-value="resetVisitEnd" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="visit_end"
          label="Fecha Salida"
          hint="Fecha de salida">
          <UiInputDate
            :initial-date="selectedRowData.visit_end || DateTime.now().toUTC().toFormat('yyyy-MM-dd HH:mm:ssZZ').slice(0, 22)"
            :disabled="selectedRowData.is_new"
            class="w-full"
            @value-changed="updateVisitEndDate" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="visit_end"
          label="Hora Salida"
          hint="Hora de salida">
          <UiInputTime
            :initial-date="selectedRowData.visit_end || DateTime.now().toUTC().toFormat('yyyy-MM-dd HH:mm:ssZZ').slice(0, 22)"
            :disabled="selectedRowData.is_new"
            class="w-full"
            @value-changed="updateVisitEndTime" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          labelTop
          name="comments_out"
          label="Comentario"
          hint="Comentario al salir">
        <UTextarea
            v-model="selectedRowData.comments_out"
            :disabled="selectedRowData.is_new"
            class="w-full"
            placeholder="Comentario al salir"
            icon="i-lucide-notebook-pen" />
        </UiDashboardSection>
      </UForm>
    </UCard>

    <UCard variant="subtle" class="mt-10">
      <UiDashboardSection
          :vertical="vertical"
          name="is_active"
          label="Eliminar registro?">
          <USwitch
            :modelValue="!selectedRowData.is_active"
            :color="!selectedRowData.is_active ? 'error' : 'success'"
            :label="!selectedRowData.is_active ? 'Eliminar' : 'No'"
            @change="selectedRowData.is_active = !selectedRowData.is_active" />
        </UiDashboardSection>
    </UCard>
  </div>
</template>