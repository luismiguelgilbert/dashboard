<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { type type_ens_members_phone } from '@/types/server/ens/ens_members';

const { state } = useEnsEquipistasForm();
const isMobile = useBreakpoints(breakpointsTailwind).smaller('sm');
const inputSize = computed(() => isMobile.value ? 'lg' : 'xl');
const phoneTypes = [
  { label: 'Celular', id: 1 },
  { label: 'Domicilio', id: 2 },
];

const addPhone = () => {
  if (state.value.data) {
    if (!state.value.data.phones) {
      state.value.data.phones = [];
    }
    state.value.data.phones.push({
      phone_number: '',
      phone_type: 1,
    });
  }
};
const removePhone = (phoneRow: type_ens_members_phone) => {
  if (state.value.data) {
    state.value.data.phones = state.value.data.phones?.filter(x => x !== phoneRow);
  }
};
</script>

<template>
  <div
    v-if="state.data"
    class="col-span-1 sm:col-span-2 pt-5">
    <UCard
      :ui="{ header: { padding: '', background: 'bg-gray-50 dark:bg-gray-800 rounded-t-lg' }, body: { padding: '' } }"
      class="min-w-0">
      <template #header>
        <div class="flex justify-between items-center text-gray-900 dark:text-white font-semibold p-3">
          <span class="pl-3">Teléfonos:</span>
          <UButton
            icon="i-heroicons-plus-circle"
            variant="ghost"
            color="gray"
            size="xl"
            @click="addPhone" />
        </div>
      </template>
      <ul
        v-if="state.data.phones?.length"
        role="list"
        class="divide-y divide-gray-200 dark:divide-gray-800">
        <li
          v-for="(row, index) in state.data.phones"
          :key="index"
          class="flex items-center justify-items-start py-5 pl-5 pr-2 gap-2">
          <div class="w-full space-y-2">
            <UInput
              v-model:model-value="row.phone_number"
              placeholder="Número de teléfono"
              class="w-full"
              :size="inputSize"
              :loading="state.isLoading" />
            <USelectMenu
              v-model="row.phone_type"
              value-attribute="id"
              option-attribute="label"
              :size="inputSize"
              :options="phoneTypes" />
          </div>
          <UButton
            icon="i-heroicons-trash"
            variant="ghost"
            color="gray"
            size="xl"
            @click="removePhone(row)" />
        </li>
      </ul>
      <div
        v-else
        class="m-2 text-sm text-gray-500 dark:text-gray-400 px-5 pb-2">
        No hay teléfonos registrados
        <UIcon name="i-heroicons-face-frown" />
      </div>
    </UCard>
  </div>
</template>