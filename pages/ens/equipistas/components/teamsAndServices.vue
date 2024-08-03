<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const { state } = useEnsEquipistasForm();
const isMobile = useBreakpoints(breakpointsTailwind).smaller('sm');
const inputSize = computed(() => isMobile.value ? 'lg' : 'xl');
const { data, pending } = await useLazyFetch('/api/lookups/ens/ens_teams_list');

const addService = () => {
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
</script>
<template>
  <div
    v-if="state.data"
    class="ml-6 mt-6 mr-6 pb-6">
    <UCard
      :ui="{ header: { padding: '', background: 'bg-gray-50 dark:bg-gray-800 rounded-t-lg' }, body: { padding: '' } }"
      class="min-w-0">
      <template #header>
        <div class="flex justify-between items-center text-gray-900 dark:text-white font-semibold p-3">
          <span class="pl-3">Equipo(s) Base:</span>
          <UButton
            icon="i-heroicons-plus-circle"
            variant="ghost"
            color="gray"
            size="xl"
            @click="addService" />
        </div>
      </template>
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
              :options="data || []" />
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
                    v-if="row.fecha_pilotaje"
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
                    v-if="row.fecha_alianza"
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
    </UCard>
  </div>
</template>