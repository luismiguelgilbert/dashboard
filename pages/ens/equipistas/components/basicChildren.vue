<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { type type_ens_members_children } from '@/types/server/ens/ens_members.js';

const { state } = useEnsEquipistasForm();
const isMobile = useBreakpoints(breakpointsTailwind).smaller('sm');
const inputSize = computed(() => isMobile.value ? 'lg' : 'xl');

const addChild = () => {
  if (state.value.data) {
    if (!state.value.data.children) {
      state.value.data.children = [];
    }
    state.value.data.children.push({
      child_name: '',
      child_sex: true,
    });
  }
};
const removeChild = (childRow: type_ens_members_children) => {
  if (state.value.data) {
    state.value.data.children = state.value.data.children?.filter(x => x !== childRow);
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
        Hijos:
        <UButton
          icon="i-heroicons-plus-circle"
          variant="ghost"
          color="gray"
          @click="addChild" />
      </div>
    </div>
    <ul
      v-if="state.data.children?.length"
      role="list">
      <li
        v-for="(row, index) in state.data.children"
        :key="index"
        class="flex items-center justify-between gap-3 py-3">
        <div class="min-w-[60%] sm:min-w-[70%] text-left">
          <span class="flex gap-x-3">
            <UButton
              icon="i-heroicons-trash"
              variant="ghost"
              color="gray"
              @click="removeChild(row)" />
            <UInput
              v-model:model-value="row.child_name"
              placeholder="Nombre"
              class="w-full"
              :size="inputSize"
              :loading="state.isLoading" />
          </span>
        </div>
        <span class="min-w-[40%] sm:min-w-[30%] text-center sm:text-right">
          <UToggle
            v-model="row.child_sex"
            :disabled="state.isLoading" />
          <span
            class="ml-5"
            style="vertical-align: text-bottom;">{{ row.child_sex ? 'Hombre' : 'Mujer' }}</span>
        </span>
      </li>
    </ul>
    <div
      v-else
      class="m-2 text-sm text-gray-500 dark:text-gray-400">
      No hay direcciones registrados
      <UIcon name="i-heroicons-face-frown" />
    </div>
  </div>
</template>