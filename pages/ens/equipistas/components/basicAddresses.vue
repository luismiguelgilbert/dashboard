<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { type type_ens_members_address } from '@/types/server/ens/ens_members';

const { state } = useEnsEquipistasForm();
const isMobile = useBreakpoints(breakpointsTailwind).smaller('sm');
const inputSize = computed(() => isMobile.value ? 'lg' : 'xl');
const addressTypes = [
  { label: 'Domicilio', id: 1 },
  { label: 'Trabajo', id: 2 },
];

const addAddress = () => {
  if (state.value.data) {
    if (!state.value.data.addresses) {
      state.value.data.addresses = [];
    }
    state.value.data.addresses.push({
      address: '',
      address_type: 1,
    });
  }
};
const removeAddress = (addressRow: type_ens_members_address) => {
  if (state.value.data) {
    state.value.data.addresses = state.value.data.addresses?.filter(x => x !== addressRow);
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
          <span class="pl-3">Direcciones:</span>
          <UButton
            icon="i-heroicons-plus-circle"
            variant="ghost"
            color="gray"
            size="xl"
            @click="addAddress" />
        </div>
      </template>
      <ul
        v-if="state.data.addresses?.length"
        role="list"
        class="divide-y divide-gray-200 dark:divide-gray-800">
        <li
          v-for="(row, index) in state.data.addresses"
          :key="index"
          class="flex items-center justify-items-start py-5 pl-5 pr-2 gap-2">
          <div class="w-full space-y-2">
            <UInput
              v-model:model-value="row.address"
              placeholder="Dirección"
              class="w-full"
              :size="inputSize"
              :loading="state.isLoading" />
            <USelectMenu
              v-model="row.address_type"
              value-attribute="id"
              option-attribute="label"
              :size="inputSize"
              :options="addressTypes" />
          </div>
          <UButton
            icon="i-heroicons-trash"
            variant="ghost"
            color="gray"
            size="xl"
            @click="removeAddress(row)" />
        </li>
      </ul>
      <div
        v-else
        class="m-2 text-sm text-gray-500 dark:text-gray-400 px-5 pb-2">
        No hay direcciones registradas
        <UIcon name="i-heroicons-face-frown" />
      </div>
    </UCard>
  </div>
</template>