<script setup lang="ts">
import { DateTime } from 'luxon';

const props = defineProps<{
  disable: boolean;
  vertical?: boolean;
}>();

const moduleStore = useBitacoraVisitsStore();
const { selectedRowData } = storeToRefs(moduleStore);

const { lookupReasons, isFetchingLookupReasons } = useLookupBitaReasons();
const { lookupVisitors, isFetchingLookupVisitors } = useLookupBitaVisitors();
const { lookupVisitorsCars, isFetchingLookupVisitorsCars } = useLookupBitaVisitorsCars();

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
            :loading="isFetchingLookupReasons"
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
          <UButtonGroup class="w-full">
            <USelectMenu
              v-model="selectedRowData.visitor_name"
              :filterFields="['visitor_name', 'visitor_number']"
              :items="lookupVisitors"
              :loading="isFetchingLookupVisitors"
              value-key="visitor_name"
              label-key="visitor_name"
              class="w-full"
              icon="i-lucide-user"
              placeholder="Select user">
              <template #item-label="{ item }">
                {{ item.visitor_name }}
                <br>
                <span class="text-muted">
                  {{ item.visitor_number }}
                </span>
                <br>
                <span
                  v-if="item.visitor_company"
                  class="items-center self-center">
                  <UIcon name="i-lucide-building" size="12" />
                  <span class="text-muted pl-1">
                    {{ item.visitor_company }}
                  </span>
                </span>
              </template>
            </USelectMenu>
            <UButton
              color="neutral"
              class="cursor-pointer"
              variant="subtle"
              icon="i-lucide-circle-plus"
              size="lg" />
          </UButtonGroup>
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          labelTop
          name="vehicle_name"
          label="Vehículo"
          hint="Descripción del vehículo">
          <UButtonGroup class="w-full">
            <USelectMenu
              v-model="selectedRowData.vehicle_name"
              :filterFields="['visitor_name', 'visitor_number']"
              :items="lookupVisitorsCars"
              :loading="isFetchingLookupVisitorsCars"
              value-key="vehicle_name"
              label-key="vehicle_plate"
              class="w-full"
              icon="i-lucide-car"
              placeholder="Select user">
              <template #item-label="{ item }">
                {{ item.vehicle_name }}
                <br>
                <span class="text-muted">
                  {{ item.vehicle_plate }}
                </span>
              </template>
            </USelectMenu>
            <UButton
              color="neutral"
              class="cursor-pointer"
              variant="subtle"
              icon="i-lucide-circle-plus"
              size="lg" />
          </UButtonGroup>
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
          <UButtonGroup class="w-full">
            <USelectMenu
              v-model="selectedRowData.visitor_name"
              :filterFields="['visitor_name', 'visitor_number']"
              :items="lookupVisitors"
              :loading="isFetchingLookupVisitors"
              value-key="visitor_name"
              label-key="visitor_name"
              class="w-full"
              icon="i-lucide-land-plot"
              placeholder="Buscar...">
              <template #item-label="{ item }">
                {{ item.visitor_name }}
                <br>
                <span class="text-muted">
                  {{ item.visitor_number }}
                </span>
                <br>
                <span
                  v-if="item.visitor_company"
                  class="items-center self-center">
                  <UIcon name="i-lucide-building" size="12" />
                  <span class="text-muted pl-1">
                    {{ item.visitor_company }}
                  </span>
                </span>
              </template>
            </USelectMenu>
            <UButton
              color="neutral"
              class="cursor-pointer"
              variant="subtle"
              icon="i-lucide-circle-plus"
              size="lg" />
          </UButtonGroup>
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
