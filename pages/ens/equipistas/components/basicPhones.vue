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
    class="col-span-1 sm:col-span-2 my-5 sm:my-0 pr-4">
    <UDivider />
    <div class="col-span-2 my-5">
      <div class="flex justify-between text-gray-900 dark:text-white font-semibold">
        Teléfonos:
        <UButton
          icon="i-heroicons-plus-circle"
          variant="ghost"
          color="gray"
          @click="addPhone" />
      </div>
    </div>
    <ul
      v-if="state.data.phones?.length"
      role="list">
      <li
        v-for="(row, index) in state.data.phones"
        :key="index"
        class="flex items-center justify-between gap-3 py-3">
        <div class="min-w-[60%] sm:min-w-[70%] text-left">
          <span class="flex gap-x-3">
            <UButton
              icon="i-heroicons-trash"
              variant="ghost"
              color="gray"
              @click="removePhone(row)" />
            <UInput
              v-model:model-value="row.phone_number"
              placeholder="Número de teléfono"
              class="w-full"
              :size="inputSize"
              :loading="state.isLoading" />
          </span>
        </div>
        <span class="min-w-[40%] sm:min-w-[30%] text-center sm:text-right">
          <USelectMenu
            v-model="row.phone_type"
            value-attribute="id"
            option-attribute="label"
            :size="inputSize"
            :options="phoneTypes" />
        </span>
      </li>
    </ul>
    <div
      v-else
      class="m-2 text-sm text-gray-500 dark:text-gray-400">
      No hay teléfonos registrados
      <UIcon name="i-heroicons-face-frown" />
    </div>
  </div>
</template>