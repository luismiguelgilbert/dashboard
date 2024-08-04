<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const { state } = useEnsEquipistasForm();
const isMobile = useBreakpoints(breakpointsTailwind).smaller('sm');
const inputSize = computed(() => isMobile.value ? 'lg' : 'xl');
const showBodyService = ref(true);

const cardUIService = computed(() => {
  return {
    divide: showBodyService.value ? 'divide-y divide-gray-200 dark:divide-gray-800' : '',
    header: { 
      padding: '',
      background: showBodyService.value ? 'bg-gray-50 dark:bg-gray-800 rounded-t-lg' : 'bg-gray-50 dark:bg-gray-800 rounded-t-lg rounded-b-lg'
    },
    body: { 
      padding: '' 
    }
  };
});

const addService = () => {
  if (state.value.data) {
    if (!state.value.data.jobs) {
      state.value.data.jobs = [];
    }
    state.value.data.jobs.push({
      id: '',
      company_name: '',
      position_name: '',
      date_start: null,
      date_stop: null,
      skills: '',
      places: '',
    });
  }
};
</script>
<template>
  <div
    v-if="state.data"
    class="ml-6 mt-6 mr-6 pb-6">
    <UCard
      :ui="cardUIService"
      class="min-w-0 mt-5">
      <template #header>
        <div class="flex justify-between items-center text-gray-900 dark:text-white font-semibold p-3">
          <div class="flex items-center">
            <UButton
              :icon="showBodyService ? 'i-hugeicons-square-arrow-up-01' : 'i-hugeicons-square-arrow-down-01'"
              variant="ghost"
              color="gray"
              size="xl"
              @click="showBodyService = !showBodyService" />
            <span class="pl-3">Empleos / Habilidades:</span>
          </div>
          <UButton
            icon="i-heroicons-plus-circle"
            variant="ghost"
            color="gray"
            size="xl"
            @click="addService" />
        </div>
      </template>
      <div v-if="showBodyService">
        <ul
          v-if="state.data.jobs?.length"
          role="list"
          class="divide-y divide-gray-200 dark:divide-gray-800">
          <li
            v-for="(row, index) in state.data.jobs"
            :key="index"
            class="flex items-center justify-items-start py-5 pl-5 pr-5 gap-2">
            <div class="w-full space-y-2">
              <UFormGroup
                :size="inputSize"
                label="Compañía / Institución:"
                name="company_name">
                <UInput
                  v-model="row.company_name"
                  required
                  placeholder="Nombre de la empresa"
                  icon="i-hugeicons-building-03"
                  class="w-full"
                  :size="inputSize"
                  :loading="state.isLoading" />
              </UFormGroup>
              <UFormGroup
                :size="inputSize"
                label="Cargo / Profesión:"
                name="position_name">
                <UInput
                  v-model="row.position_name"
                  required
                  placeholder="Nombre de la posición"
                  icon="i-hugeicons-permanent-job"
                  class="w-full"
                  :size="inputSize"
                  :loading="state.isLoading" />
              </UFormGroup>
              <UFormGroup
                :size="inputSize"
                label="Desde:"
                name="birdate_startthday">
                <UPopover :popper="{ placement: 'top-start' }">
                  <UInput
                    :value="row.date_start ? format(toZonedTime(row.date_start, 'UTC'), 'd MMM y') : ''"
                    required
                    readonly
                    placeholder="Fecha de inicio"
                    icon="i-hugeicons-calendar-add-02"
                    class="w-full"
                    :size="inputSize"
                    :loading="state.isLoading" />
                  <template #panel="{ close }">
                    <DatePicker
                      v-model="row.date_start"
                      is-required
                      :timezone="'UTC'"
                      @close="close"
                      @update:model-value="(value) => row.date_start = value.toISOString()" />
                  </template>
                </UPopover>
              </UFormGroup>
              <UFormGroup
                class="pb-5"
                :size="inputSize"
                label="Hasta:"
                name="date_stop">
                <UPopover :popper="{ placement: 'top-start' }">
                  <UInput
                    :value="row.date_stop ? format(toZonedTime(row.date_stop, 'UTC'), 'd MMM y') : ''"
                    required
                    placeholder="Fecha de finalización"
                    icon="i-hugeicons-calendar-block-02"
                    class="w-full"
                    readonly
                    :size="inputSize"
                    :loading="state.isLoading" />
                  <template #panel="{ close }">
                    <DatePicker
                      v-model="row.date_stop"
                      is-required
                      :timezone="'UTC'"
                      @close="close"
                      @update:model-value="(value) => row.date_stop = value.toISOString()" />
                  </template>
                </UPopover>
              </UFormGroup>
              <UFormGroup
                :size="inputSize"
                label="Cobertura (Ciudades):"
                name="places">
                <UInput
                  :value="row.places"
                  required
                  placeholder="Describa las ciudades/provincias/países de cobertura"
                  icon="i-hugeicons-maps-location-01"
                  class="w-full"
                  :size="inputSize"
                  :loading="state.isLoading" />
              </UFormGroup>
              <UFormGroup
                :size="inputSize"
                label="Cobertura (Ciudades):"
                name="skills">
                <UTextarea
                  v-model="row.skills"
                  required
                  placeholder="Describa las ciudades/provincias/países de cobertura"
                  icon="i-hugeicons-maps-location-01"
                  class="w-full"
                  :size="inputSize"
                  :loading="state.isLoading" />
              </UFormGroup>
            </div>
          </li>
        </ul>
        <div
          v-else
          class="m-2 text-sm text-gray-500 dark:text-gray-400 px-5 pb-2">
          No hay registros
          <UIcon name="i-heroicons-face-frown" />
        </div>
      </div>
    </UCard>
  </div>
</template>