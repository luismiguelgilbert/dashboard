<script setup lang="ts">
import { DateTime } from 'luxon';

const props = defineProps<{
  disable: boolean;
  vertical?: boolean;
}>();

const moduleStore = useBitacoraVisitsStore();
const { selectedRowData } = storeToRefs(moduleStore);
const userCompany = useState<sys_companies | undefined>('userCompany');
const headers = useRequestHeaders(['cookie']);

const {
  data: lookupReasons,
  isFetching: isFetchingLookupReasons,
} = useQuery({
  queryKey: ['lookup-bita-reasons', userCompany.value?.id],
  queryFn: () => $fetch(`/api/lookup/${userCompany.value?.id}/bitacora/reasons`, { method: 'get', headers }),
  staleTime: 1000 * 60 * 1440, // 1440 minutes = 1 day
});

const updateVisitStartDate = (newDate: string) => {
  if (selectedRowData.value?.visit_start) {
    const modelDate = DateTime.fromSQL(selectedRowData.value.visit_start).toISO()?.toString();
    const newModelDate = DateTime.fromFormat(`${newDate} ${modelDate?.slice(11, 16)}`, 'yyyy-MM-dd HH:mm');
    selectedRowData.value.visit_start = newModelDate.toUTC().toFormat('yyyy-MM-dd HH:mm:ssZZ').slice(0, 22);
  }
};
const updateVisitStartTime = (newTime: string) => {
  if (selectedRowData.value?.visit_start) {
    const modelDate = DateTime.fromSQL(selectedRowData.value.visit_start).toISO()?.toString();
    const newDate = `${modelDate?.slice(0, 10)}T${newTime}${modelDate?.slice(16, 29)}`;
    selectedRowData.value.visit_start = DateTime.fromFormat(newDate, `yyyy-MM-dd'T'HH:mm:ss.SSSZZ`).toUTC().toFormat('yyyy-MM-dd HH:mm:ssZZ').slice(0, 22);
  }
};
</script>

<template>
  <div
    v-if="selectedRowData"
    class="m-4 md:m-6">
    <UPageFeature
      title="Datos de la Visita"
      description="Información del visitante" />
    <br>

    <UCard variant="subtle">
      <UForm
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="bitacora_visits_schema">
        <UiDashboardSection
          :vertical="vertical"
          name="name_es"
          label="Fecha Ingreso"
          hint="Fecha de ingreso">
          <UiInputDate
            :initial-date="selectedRowData.visit_start"
            :disabled="!selectedRowData.is_new"
            class="w-full"
            @value-changed="updateVisitStartDate" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="name_es"
          label="Hora Ingreso"
          hint="Hora de ingreso">
          <UiInputTime
            :initial-date="selectedRowData.visit_start"
            :disabled="!selectedRowData.is_new"
            class="w-full"
            @value-changed="updateVisitStartTime" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          v-model="selectedRowData.reason_id"
          name="reason_id"
          label="Motivo"
          hint="Motivo de la visita">
          <USelect
            v-model="selectedRowData.reason_id"
            :items="lookupReasons"
            label-key="name_es"
            value-key="id"
            class="w-full" />
        </UiDashboardSection>
      </UForm>
    </UCard>
    <br>

    <UCard variant="subtle">
      <UForm
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="bitacora_visits_schema">
        <UiDashboardSection
          :vertical="vertical"
          labelTop
          name="visitor_name"
          label="Visitante"
          hint="Nombre del visitante">
        <UInput
            v-model="selectedRowData.visitor_name"
            :disabled="!selectedRowData.is_new"
            class="w-full"
            placeholder="Nombre del visitante"
            icon="i-lucide-user" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          labelTop
          name="visitor_number"
          label="Visitante"
          hint="Identificación del visitante">
        <UInput
            v-model="selectedRowData.visitor_number"
            :disabled="!selectedRowData.is_new"
            class="w-full"
            placeholder="Identificación del visitante"
            icon="i-lucide-user" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          labelTop
          name="visitor_company"
          label="Visitante"
          hint="Compañía del visitante">
        <UInput
            v-model="selectedRowData.visitor_company"
            :disabled="!selectedRowData.is_new"
            class="w-full"
            placeholder="Compañía del visitante"
            icon="i-lucide-user" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          labelTop
          name="vehicle_name"
          label="Vehículo"
          hint="Descripción del vehículo">
        <UInput
            v-model="selectedRowData.vehicle_name"
            :disabled="!selectedRowData.is_new"
            class="w-full"
            placeholder="Descripción del vehículo"
            icon="i-lucide-car" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          labelTop
          name="vehicle_plate"
          label="Vehículo"
          hint="Placa del vehículo">
        <UInput
            v-model="selectedRowData.vehicle_plate"
            :disabled="!selectedRowData.is_new"
            class="w-full"
            placeholder="Placa del vehículo"
            icon="i-lucide-car-front" />
        </UiDashboardSection>
      </UForm>
    </UCard>
    <br>

    <UCard variant="subtle">
      <UForm
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="bitacora_visits_schema">
        <UiDashboardSection
          :vertical="vertical"
          labelTop
          name="visited_name"
          label="Visita a"
          hint="Pregunta por">
        <UInput
            v-model="selectedRowData.visited_name"
            :disabled="!selectedRowData.is_new"
            class="w-full"
            placeholder="Nombre de persona por quien pregunta"
            icon="i-lucide-circle-user-round" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          labelTop
          name="visited_area"
          label="Visita a"
          hint="Área que visita">
        <UInput
            v-model="selectedRowData.visited_area"
            :disabled="!selectedRowData.is_new"
            class="w-full"
            placeholder="Área que visita"
            icon="i-lucide-land-plot" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          labelTop
          name="visitor_company"
          label="Comentario"
          hint="Comentario al ingreso">
        <UTextarea
            v-model="selectedRowData.comments_in"
            :disabled="!selectedRowData.is_new"
            class="w-full"
            placeholder="Comentario al ingreso"
            icon="i-lucide-notebook-pen" />
        </UiDashboardSection>
      </UForm>
    </UCard>
    <br>
  </div>
</template>
