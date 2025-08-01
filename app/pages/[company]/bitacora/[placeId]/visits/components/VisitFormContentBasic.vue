<script setup lang="ts">
import { DateTime } from 'luxon';

const props = defineProps<{
  disable: boolean;
  vertical?: boolean;
}>();

const moduleStore = useBitacoraVisitsStore();
const { selectedRowData } = storeToRefs(moduleStore);
const { lookupReasons, isFetchingLookupReasons } = useLookupBitaReasons();
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
        selectedRowData.value.visitor_name = visitor.visitor_name;
        selectedRowData.value.visitor_number = visitor.visitor_number;
        selectedRowData.value.visitor_company = visitor.visitor_company;
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
    selectedRowData.value.visitor_name = newVisitor.value.visitor_name;
    selectedRowData.value.visitor_number = newVisitor.value.visitor_number;
    selectedRowData.value.visitor_company = newVisitor.value.visitor_company;
    visitorInpuSelect.value?.closeDrawer();
  }
};
// Visitors Cars data
const visitorCarInpuSelect = useTemplateRef('visitorCarInpuSelect');
const { lookupVisitorsCars, isFetchingLookupVisitorsCars, updateLookupVisitorsCars } = useLookupBitaVisitorsCars();
const newVisitorCar = ref<lookup_bitacora_visitors_cars>({
  vehicle_name: '',
  vehicle_plate: '',
});
const lookupVisitorsCarsWithAction = computed(() => 
  lookupVisitorsCars.value?.map((visitorCar) => ({
    ...visitorCar,
    onSelect: () => {
      if (selectedRowData.value) {
        selectedRowData.value.vehicle_name = visitorCar.vehicle_name ?? null;
        selectedRowData.value.vehicle_plate = visitorCar.vehicle_plate ?? null;
      }
    },
  }))
);
const addVisitorCar = () => {
  if (selectedRowData.value
    && newVisitorCar.value.vehicle_name && newVisitorCar.value.vehicle_name.trim().length > 0
    && newVisitorCar.value.vehicle_plate && newVisitorCar.value.vehicle_plate.trim().length > 0
    && lookupVisitorsCars.value) {
    updateLookupVisitorsCars(newVisitorCar.value);
    selectedRowData.value.vehicle_name = newVisitorCar.value.vehicle_name;
    selectedRowData.value.vehicle_plate = newVisitorCar.value.vehicle_plate;
    visitorCarInpuSelect.value?.closeDrawer();
  }
};
// Visited data
const visitedInpuSelect = useTemplateRef('visitedInpuSelect');
const { lookupVisited, isFetchingLookupVisited, updateLookupVisited } = useLookupBitaVisited();
const newVisited = ref<lookup_bitacora_visited>({
  visited_name: '',
  visited_area: '',
});
const lookupVisitedWithAction = computed(() => 
  lookupVisited.value?.map((visited) => ({
    ...visited,
    onSelect: () => {
      if (selectedRowData.value) {
        selectedRowData.value.visited_name = visited.visited_name ?? null;
        selectedRowData.value.visited_area = visited.visited_area ?? null;
      }
    },
  }))
);
const addVisited = () => {
  if (selectedRowData.value
    && newVisited.value.visited_name && newVisited.value.visited_name.trim().length > 0
    && lookupVisitorsCars.value) {
    updateLookupVisited(newVisited.value);
    selectedRowData.value.visited_name = newVisited.value.visited_name;
    selectedRowData.value.visited_area = newVisited.value.visited_area ?? null;
    visitedInpuSelect.value?.closeDrawer();
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
          name="visit_start"
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
          name="visit_start"
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
            :items="lookupReasons?.filter((record) => record.is_active)"
            :loading="isFetchingLookupReasons"
            :disabled="!selectedRowData.is_new"
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
            :disabled="!selectedRowData.is_new"
            @save="addVisitor">
            <template #selectMenu>
              <USelectMenu
                v-model="selectedRowData.visitor_name"
                value-key="visitor_name"
                label-key="visitor_name"
                icon="i-lucide-user"
                class="overflow-x-hidden"
                placeholder="Buscar visitante..."
                :disabled="!selectedRowData.is_new"
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
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          labelTop
          name="vehicle_plate"
          label="Vehículo"
          hint="Descripción del vehículo">
          <UiInputSelect
            ref="visitorCarInpuSelect"
            title="Agregar visitante"
            :disabled="!selectedRowData.is_new"
            @save="addVisitorCar">
            <template #selectMenu>
              <USelectMenu
                v-model="selectedRowData.vehicle_plate"
                value-key="vehicle_plate"
                label-key="vehicle_plate"
                icon="i-lucide-car"
                class="overflow-x-hidden"
                placeholder="Buscar vehículo..."
                :disabled="!selectedRowData.is_new"
                :items="lookupVisitorsCarsWithAction"
                :loading="isFetchingLookupVisitorsCars"
                :filterFields="['vehicle_plate', 'vehicle_name']"
                :ui="{ base: 'w-full' }"
                :search-input="{
                  placeholder: 'Buscar vehículo...',
                  icon: 'i-lucide-search',
                }">
                <template #item-label="{ item }">
                  {{ item.vehicle_plate }} <br>
                  <span class="text-muted">{{ item.vehicle_name }}</span>
                </template>
              </USelectMenu>
            </template>
            <template #draw-content>
              <UFormField size="xl" label="Placa" required>
                <UInput
                  v-model="newVisitorCar.vehicle_plate"
                  autofocus
                  class="w-full"
                  placeholder="Placa del vehículo"
                  icon="i-lucide-car" />
              </UFormField>
              <UFormField size="xl" label="Descripción" required class="mt-5">
                <UInput
                  v-model="newVisitorCar.vehicle_name"
                  class="w-full"
                  placeholder="Descripción del Vehículo"
                  icon="i-lucide-car" />
              </UFormField>
            </template>
          </UiInputSelect>
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
          <UiInputSelect
            ref="visitedInpuSelect"
            title="Agregar persona"
            :disabled="!selectedRowData.is_new"
            @save="addVisited">
            <template #selectMenu>
              <USelectMenu
                v-model="selectedRowData.visited_name"
                value-key="visited_name"
                label-key="visited_name"
                icon="i-lucide-user-circle"
                class="overflow-x-hidden"
                placeholder="Buscar persona..."
                :disabled="!selectedRowData.is_new"
                :items="lookupVisitedWithAction"
                :loading="isFetchingLookupVisited"
                :filterFields="['visited_name', 'visited_area']"
                :ui="{ base: 'w-full' }"
                :search-input="{
                  placeholder: 'Buscar persona...',
                  icon: 'i-lucide-search',
                }">
                <template #item-label="{ item }">
                  {{ item.visited_name }} <br>
                  <span class="text-muted">{{ item.visited_area }}</span>
                </template>
              </USelectMenu>
            </template>
            <template #draw-content>
              <UFormField size="xl" label="Persona" required>
                <UInput
                  v-model="newVisited.visited_name"
                  autofocus
                  class="w-full"
                  placeholder="Nombre de la persona"
                  icon="i-lucide-user-circle" />
              </UFormField>
              <UFormField size="xl" label="Área" class="mt-5">
                <UInput
                  v-model="newVisited.visited_area"
                  class="w-full"
                  placeholder="Área donde trabaja"
                  icon="i-lucide-land-plot" />
              </UFormField>
            </template>
          </UiInputSelect>
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          labelTop
          name="comments_in"
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
