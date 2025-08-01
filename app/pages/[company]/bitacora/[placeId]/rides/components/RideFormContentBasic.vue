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
const { lookupBitaRiders, isFetchingLookupRiders, updateLookupRiders } = useLookupBitaRiders();
const newVisitor = ref<lookup_bitacora_riders>({
  driver: '',
});
const lookupRidersWithAction = computed(() => 
  lookupBitaRiders.value?.map((visitor) => ({
    ...visitor,
    onSelect: () => {
      if (selectedRowData.value) {
        selectedRowData.value.driver = visitor.driver;
      }
    },
  }))
);
const addChofer = () => {
  if (selectedRowData.value
    && newVisitor.value.driver.trim().length > 0
    && lookupBitaRiders.value) {
    updateLookupRiders(newVisitor.value);
    selectedRowData.value.driver = newVisitor.value.driver;
    visitorInpuSelect.value?.closeDrawer();
  }
};
</script>

<template>
  <div
    v-if="selectedRowData"
    class="m-4 md:m-6">
    <UPageFeature
      title="Datos del Viaje"
      description="Información del viaje" />
    <br>

    <UCard variant="subtle">
      <UForm
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="bitacora_visits_schema">
        <UiDashboardSection
          :vertical="vertical"
          name="ride_start"
          label="Inicio de viaje"
          hint="Fecha de salida">
          <UiInputDate
            v-if="selectedRowData.ride_start"
            :initial-date="selectedRowData.ride_start"
            :disabled="!selectedRowData.is_new"
            class="w-full"
            @value-changed="updateRideStartDate" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="ride_start"
          label="Inicio de viaje"
          hint="Hora de salida">
          <UiInputTime
            v-if="selectedRowData.ride_start"
            :initial-date="selectedRowData.ride_start"
            :disabled="!selectedRowData.is_new"
            class="w-full"
            @value-changed="updateRideStartTime" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="ride_start_km"
          label="Inicio de viaje"
          hint="Kilomentraje al salir">
          <UInputNumber
            v-model="selectedRowData.ride_start_km"
            :disabled="!selectedRowData.is_new"
            class="w-full"
            orientation="vertical" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          v-model="selectedRowData.reason_id"
          :vertical="vertical"
          name="reason_id"
          label="Motivo"
          hint="Motivo de viaje">
          <USelect
            v-model="selectedRowData.reason_id"
            :items="lookupRideReasons?.filter((record) => record.is_active)"
            :loading="isFetchingLookupRideReasons"
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
          name="driver"
          label="Responsable"
          hint="Nombre del chofer">
          <UiInputSelect
            ref="visitorInpuSelect"
            title="Agregar chofer"
            :disabled="!selectedRowData.is_new"
            @save="addChofer">
            <template #selectMenu>
              <USelectMenu
                v-model="selectedRowData.driver"
                value-key="driver"
                label-key="driver"
                icon="i-lucide-user"
                class="overflow-x-hidden"
                placeholder="Buscar chofer..."
                :disabled="!selectedRowData.is_new"
                :loading="isFetchingLookupRiders"
                :items="lookupRidersWithAction"
                :filterFields="['driver']"
                :ui="{ base: 'w-full' }"
                :search-input="{
                  placeholder: 'Buscar chofer...',
                  icon: 'i-lucide-search',
                }">
                <template #item-label="{ item }">
                  {{ item.driver }} <br>
                </template>
              </USelectMenu>
            </template>
            <template #draw-content>
              <UFormField size="xl" label="Nombre" required>
                <UInput
                  v-model="newVisitor.driver"
                  :disabled="!selectedRowData.is_new"
                  autofocus
                  class="w-full"
                  placeholder="Nombre del chofer"
                  icon="i-lucide-user-round" />
              </UFormField>
            </template>
          </UiInputSelect>
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          labelTop
          name="ride_start_comment"
          label="Comentario"
          hint="Comentario al salir">
        <UTextarea
            v-model="selectedRowData.ride_start_comment"
            :disabled="!selectedRowData.is_new"
            class="w-full"
            placeholder="Comentario al salir"
            icon="i-lucide-notebook-pen" />
        </UiDashboardSection>
      </UForm>
    </UCard>
    <br>
  </div>
</template>
