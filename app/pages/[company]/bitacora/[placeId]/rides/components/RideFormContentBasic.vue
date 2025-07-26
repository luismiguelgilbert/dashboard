<script setup lang="ts">
import { DateTime } from 'luxon';

const props = defineProps<{
  disable: boolean;
  vertical?: boolean;
}>();

const moduleStore = useBitacoraRidesStore();
const { selectedRowData } = storeToRefs(moduleStore);
const { lookupRideReasons, isFetchingLookupRideReasons } = useLookupBitaRideReasons();
const updateRideStartDate = (newDate: string) => {
  if (selectedRowData.value?.ride_start) {
    const modelDate = DateTime.fromSQL(selectedRowData.value.ride_start).toISO()?.toString();
    const newModelDate = DateTime.fromFormat(`${newDate} ${modelDate?.slice(11, 16)}`, 'yyyy-MM-dd HH:mm');
    selectedRowData.value.ride_start = newModelDate.toUTC().toFormat('yyyy-MM-dd HH:mm:ssZZ').slice(0, 22);
  }
};
const updateRideStartTime = (newTime: string) => {
  if (selectedRowData.value?.ride_start) {
    const modelDate = DateTime.fromSQL(selectedRowData.value.ride_start).toISO()?.toString();
    const newDate = `${modelDate?.slice(0, 10)}T${newTime}${modelDate?.slice(16, 29)}`;
    selectedRowData.value.ride_start = DateTime.fromFormat(newDate, `yyyy-MM-dd'T'HH:mm:ss.SSSZZ`).toUTC().toFormat('yyyy-MM-dd HH:mm:ssZZ').slice(0, 22);
  }
};
// Visitors data
const visitorInpuSelect = useTemplateRef('visitorInpuSelect');
const { lookupVisitors, isFetchingLookupVisitors, updateLookupVisitors } = useLookupBitaVisitors();
const newVisitor = ref<lookup_bitacora_visitors>({
  visitor_name: '',
  visitor_number: '',
  visitor_company: null,
});
const lookupVisitorsWithAction = computed(() => 
  lookupVisitors.value?.map((visitor) => ({
    ...visitor,
    onSelect: () => {
      if (selectedRowData.value) {
        selectedRowData.value.driver = visitor.visitor_name;
      }
    },
  }))
);
const addVisitor = () => {
  if (selectedRowData.value
    && newVisitor.value.visitor_name.trim().length > 0
    && newVisitor.value.visitor_number.trim().length > 0
    && lookupVisitors.value) {
    updateLookupVisitors(newVisitor.value);
    // selectedRowData.value.visitor_name = newVisitor.value.visitor_name;
    // selectedRowData.value.visitor_number = newVisitor.value.visitor_number;
    // selectedRowData.value.driver = newVisitor.value.visitor_company;
    visitorInpuSelect.value?.closeDrawer();
  }
};
// const lookupVisitorsCarsWithAction = computed(() => 
//   lookupVisitorsCars.value?.map((visitorCar) => ({
//     ...visitorCar,
//     onSelect: () => {
//       if (selectedRowData.value) {
//         selectedRowData.value.vehicle_name = visitorCar.vehicle_name ?? null;
//         selectedRowData.value.vehicle_plate = visitorCar.vehicle_plate ?? null;
//       }
//     },
//   }))
// );
// const lookupVisitedWithAction = computed(() => 
//   lookupVisited.value?.map((visited) => ({
//     ...visited,
//     onSelect: () => {
//       if (selectedRowData.value) {
//         selectedRowData.value.visited_name = visited.visited_name ?? null;
//         selectedRowData.value.visited_area = visited.visited_area ?? null;
//       }
//     },
//   }))
// );
// const addVisited = () => {
//   if (selectedRowData.value
//     && newVisited.value.visited_name && newVisited.value.visited_name.trim().length > 0
//     && lookupVisitorsCars.value) {
//     updateLookupVisited(newVisited.value);
//     selectedRowData.value.visited_name = newVisited.value.visited_name;
//     selectedRowData.value.visited_area = newVisited.value.visited_area ?? null;
//     visitedInpuSelect.value?.closeDrawer();
//   }
// };
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
      {{ selectedRowData }}
      <UForm
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="bitacora_visits_schema">
        <UiDashboardSection
          :vertical="vertical"
          name="ride_start"
          label="Fecha Inicio"
          hint="Fecha de inicio">
          <UiInputDate
            v-if="selectedRowData.ride_start"
            :initial-date="selectedRowData.ride_start"
            class="w-full"
            @value-changed="updateRideStartDate" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="ride_start"
          label="Hora Inicio"
          hint="Hora de inicio">
          <UiInputTime
            v-if="selectedRowData.ride_start"
            :initial-date="selectedRowData.ride_start"
            class="w-full"
            @value-changed="updateRideStartTime" />
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
            :items="lookupRideReasons?.filter((record) => record.is_active)"
            :loading="isFetchingLookupRideReasons"
            icon="i-lucide-list-check"
            label-key="name_es"
            value-key="id"
            class="w-full" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          labelTop
          name="visitor_name"
          label="Visitante"
          hint="Nombre del visitante">
          <UiInputSelect
            ref="visitorInpuSelect"
            title="Agregar visitante"
            @save="addVisitor">
            <template #selectMenu>
              <USelectMenu
                v-model="selectedRowData.driver"
                value-key="visitor_name"
                label-key="visitor_name"
                icon="i-lucide-user"
                class="overflow-x-hidden"
                placeholder="Buscar visitante..."
                :loading="isFetchingLookupVisitors"
                :items="lookupVisitorsWithAction"
                :filterFields="['visitor_name', 'visitor_number']"
                :ui="{ base: 'w-full' }"
                :search-input="{
                  placeholder: 'Buscar visitante...',
                  icon: 'i-lucide-search',
                }">
                <template #item-label="{ item }">
                  {{ item.visitor_name }} <br>
                  <span class="text-muted">{{ item.visitor_number }}</span><br>
                  <span class="text-muted">{{ item.visitor_company }}</span>
                </template>
              </USelectMenu>
            </template>
            <template #draw-content>
              <UFormField size="xl" label="Nombre" required>
                <UInput
                  v-model="newVisitor.visitor_name"
                  autofocus
                  class="w-full"
                  placeholder="Nombre del visitante"
                  icon="i-lucide-user-round" />
              </UFormField>
              <UFormField size="xl" label="Cédula" required class="mt-5">
                <UInput
                  v-model="newVisitor.visitor_number"
                  class="w-full"
                  placeholder="Número de Identificación"
                  icon="i-lucide-id-card" />
              </UFormField>
              <UFormField size="xl" label="Empresa" class="mt-5">
                <UInput
                  v-model="newVisitor.visitor_company"
                  class="w-full"
                  placeholder="Empresa donde trabaja"
                  icon="i-lucide-building-2" />
              </UFormField>
            </template>
          </UiInputSelect>
        </UiDashboardSection>
      </UForm>
    </UCard>
    <br>
  </div>
</template>
