<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const { state } = useEnsEquipistasForm();
const isMobile = useBreakpoints(breakpointsTailwind).smaller('sm');
const inputSize = computed(() => isMobile.value ? 'lg' : 'xl');
const showBodyTeam = ref(true);
const showBodyService = ref(true);
const { data, pending } = await useLazyFetch('/api/lookups/ens/ens_teams_list');
const { data: dataServices, pending: pendingServices } = await useLazyFetch('/api/lookups/ens/ens_services_list');

const cardUITeam = computed(() => {
  return {
    divide: showBodyTeam.value ? 'divide-y divide-gray-200 dark:divide-gray-800' : '',
    header: { 
      padding: '',
      background: showBodyTeam.value ? 'bg-gray-50 dark:bg-gray-800 rounded-t-lg' : 'bg-gray-50 dark:bg-gray-800 rounded-t-lg rounded-b-lg'
    },
    body: { 
      padding: '' 
    }
  };
});
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

const computedData = computed(() => {
  return data.value?.map((x: any) => {
    return {
      ...x,
      disabled: !x.is_active,
    };
  });
});

const computedDataServices = computed(() => {
  return dataServices.value?.map((x: any) => {
    return {
      ...x,
      disabled: !x.is_active,
    };
  });
});

const addTeam = () => {
  if (state.value.data) {
    if (!state.value.data.teams) {
      state.value.data.teams = [];
    }
    state.value.data.teams.push({
      team_id: '',
      fecha_pilotaje: null,
      fecha_alianza: null,
      is_active: true,
    });
  }
};

const addService = () => {
  if (state.value.data) {
    if (!state.value.data.services) {
      state.value.data.services = [];
    }
    state.value.data.services.push({
      service_id: '',
      date_start: null,
      date_stop: null,
      is_active: true,
    });
  }
};
</script>
<template>
  <div
    v-if="state.data"
    class="ml-6 mt-6 mr-6 pb-6">
    <UCard
      :ui="cardUITeam"
      class="min-w-0">
      <template #header>
        <div class="flex justify-between items-center text-gray-900 dark:text-white font-semibold p-3">
          <div class="flex items-center">
            <UButton
              :icon="showBodyTeam ? 'i-hugeicons-square-arrow-up-01' : 'i-hugeicons-square-arrow-down-01'"
              variant="ghost"
              color="gray"
              size="xl"
              @click="showBodyTeam = !showBodyTeam" />
            <span class="pl-3">Equipo(s) Base:</span>
          </div>
          <UButton
            icon="i-heroicons-plus-circle"
            variant="ghost"
            color="gray"
            size="xl"
            @click="addTeam" />
        </div>
      </template>
      <div v-if="showBodyTeam">
        <ul
          v-if="state.data.teams?.length"
          role="list"
          class="divide-y divide-gray-200 dark:divide-gray-800">
          <li
            v-for="(row, index) in state.data.teams"
            :key="index"
            class="flex items-center justify-items-start py-5 pl-5 pr-5 gap-2">
            <div class="w-full space-y-2">
              <USelectMenu
                v-model="row.team_id"
                value-attribute="id"
                option-attribute="name_es"
                searchable
                :loading="pending"
                :size="inputSize"
                :options="computedData || []" />
              <UFormGroup
                :size="inputSize"
                label="Fecha de Pilotaje:"
                name="birthday">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UInput
                    :value="row.fecha_pilotaje ? format(toZonedTime(row.fecha_pilotaje, 'UTC'), 'd MMM y') : ''"
                    required
                    placeholder="Pilotaje"
                    icon="i-hugeicons-customer-support"
                    class="w-full"
                    readonly
                    :ui="inputSize"
                    :loading="state.isLoading" />
                  <template #panel="{ close }">
                    <DatePicker
                      v-model="row.fecha_pilotaje"
                      is-required
                      :timezone="'UTC'"
                      @close="close"
                      @update:model-value="(value) => row.fecha_pilotaje = value.toISOString()" />
                  </template>
                </UPopover>
              </UFormGroup>
              <UFormGroup
                class="pb-5"
                :size="inputSize"
                label="Fecha de Alianza:"
                name="birthday">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UInput
                    :value="row.fecha_alianza ? format(toZonedTime(row.fecha_alianza, 'UTC'), 'd MMM y') : ''"
                    required
                    placeholder="cumpleaños"
                    icon="i-hugeicons-checkmark-circle-01"
                    class="w-full"
                    readonly
                    :ui="inputSize"
                    :loading="state.isLoading" />
                  <template #panel="{ close }">
                    <DatePicker
                      v-model="row.fecha_alianza"
                      is-required
                      :timezone="'UTC'"
                      @close="close"
                      @update:model-value="(value) => row.fecha_alianza = value.toISOString()" />
                  </template>
                </UPopover>
              </UFormGroup>
              <UPricingToggle
                v-model="row.is_active"
                left="Inactivo"
                right="Activo" />
              <UFormGroup
                v-if="!row.is_active"
                :size="inputSize"
                label="Fecha de Salida:"
                name="salida">
                <UPopover :popper="{ placement: 'top-end' }">
                  <UInput
                    :value="row.fecha_salida ? format(toZonedTime(row.fecha_salida, 'UTC'), 'd MMM y') : ''"
                    required
                    placeholder="Fecha de Salida"
                    icon="i-hugeicons-user-remove-02"
                    class="w-full"
                    readonly
                    :ui="inputSize"
                    :loading="state.isLoading" />
                  <template #panel="{ close }">
                    <DatePicker
                      v-model="row.fecha_salida"
                      is-required
                      :timezone="'UTC'"
                      @close="close"
                      @update:model-value="(value) => row.fecha_salida = value.toISOString()" />
                  </template>
                </UPopover>
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
            <span class="pl-3">Servicios:</span>
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
          v-if="state.data.services?.length"
          role="list"
          class="divide-y divide-gray-200 dark:divide-gray-800">
          <li
            v-for="(row, index) in state.data.services"
            :key="index"
            class="flex items-center justify-items-start py-5 pl-5 pr-5 gap-2">
            <div class="w-full space-y-2">
              <USelectMenu
                v-model="row.service_id"
                value-attribute="id"
                option-attribute="name_es"
                searchable
                :loading="pendingServices"
                :size="inputSize"
                :options="computedDataServices || []" />
              <UFormGroup
                :size="inputSize"
                label="Inicio de Servicio:"
                name="birthday">
                <UPopover :popper="{ placement: 'top-end' }">
                  <UInput
                    :value="row.date_start ? format(toZonedTime(row.date_start, 'UTC'), 'd MMM y') : ''"
                    required
                    placeholder="Inicio de Servicio"
                    icon="i-hugeicons-workout-stretching"
                    class="w-full"
                    readonly
                    :ui="inputSize"
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
                label="Fin de Servicio:"
                name="birthday">
                <UPopover :popper="{ placement: 'top-end' }">
                  <UInput
                    :value="row.date_stop ? format(toZonedTime(row.date_stop, 'UTC'), 'd MMM y') : ''"
                    required
                    placeholder="Fin de servicio"
                    icon="i-hugeicons-sleeping"
                    class="w-full"
                    readonly
                    :ui="inputSize"
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
              <UPricingToggle
                v-model="row.is_active"
                left="Inactivo"
                right="Activo" />
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