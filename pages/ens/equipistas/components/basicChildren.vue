<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { type type_ens_members_children } from '@/types/server/ens/ens_members.js';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const { state } = useEnsEquipistasForm();
const isMobile = useBreakpoints(breakpointsTailwind).smaller('sm');
const showBody = ref(true);
const inputSize = computed(() => isMobile.value ? 'lg' : 'xl');
const cardUI = computed(() => {
  return {
    divide: showBody.value ? 'divide-y divide-gray-200 dark:divide-gray-800' : '',
    header: { 
      padding: '',
      background: showBody.value ? 'bg-gray-50 dark:bg-gray-800 rounded-t-lg' : 'bg-gray-50 dark:bg-gray-800 rounded-t-lg rounded-b-lg'
    },
    body: { 
      padding: '' 
    }
  };
});
const phoneTypes = [
  { label: 'Hombre', id: true },
  { label: 'Mujer', id: false },
];

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
    class="col-span-1 sm:col-span-2 pt-5">
    <UCard
      :ui="cardUI"
      class="min-w-0">
      <template #header>
        <div class="flex justify-between items-center text-gray-900 dark:text-white font-semibold p-3">
          <div class="flex items-center">
            <UButton
              :icon="showBody ? 'i-hugeicons-square-arrow-up-01' : 'i-hugeicons-square-arrow-down-01'"
              variant="ghost"
              color="gray"
              size="xl"
              @click="showBody = !showBody" />
            <span class="pl-3">Hijos:</span>
          </div>
          <UButton
            icon="i-heroicons-plus-circle"
            variant="ghost"
            color="gray"
            size="xl"
            @click="addChild" />
        </div>
      </template>
      <div v-if="showBody">
        <ul
          v-if="state.data.children?.length"
          role="list"
          class="divide-y divide-gray-200 dark:divide-gray-800">
          <li
            v-for="(row, index) in state.data.children"
            :key="index"
            class="flex items-center justify-items-start py-5 pl-5 pr-2 gap-2">
            <div class="w-full space-y-2">
              <UInput
                v-model:model-value="row.child_name"
                placeholder="Nombre"
                class="w-full"
                :size="inputSize"
                :loading="state.isLoading" />
              <USelectMenu
                v-model="row.child_sex"
                value-attribute="id"
                option-attribute="label"
                :size="inputSize"
                :options="phoneTypes" />
              <UFormGroup
                :size="inputSize"
                name="birthday">
                <UPopover :popper="{ placement: 'top-start' }">
                  <UInput
                    :value="row.birthday ? format(toZonedTime(row.birthday, 'UTC'), 'd MMM y') : ''"
                    required
                    placeholder="Fecha de Nacimiento (Cumpleaños)"
                    icon="i-hugeicons-birthday-cake"
                    class="w-full"
                    readonly
                    :size="inputSize"
                    :loading="state.isLoading" />
                  <template #panel="{ close }">
                    <DatePicker
                      v-model="row.birthday"
                      is-required
                      :timezone="'UTC'"
                      @close="close"
                      @update:model-value="(value) => row.birthday = value.toISOString()" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
            <UButton
              icon="i-heroicons-trash"
              variant="ghost"
              color="gray"
              size="xl"
              @click="removeChild(row)" />
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