<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { type type_ens_members_mail } from '@/types/server/ens/ens_members';

const { state } = useEnsEquipistasForm();
const isMobile = useBreakpoints(breakpointsTailwind).smaller('sm');
const inputSize = computed(() => isMobile.value ? 'lg' : 'xl');

const addMail = () => {
  if (state.value.data) {
    if (!state.value.data.emails) {
      state.value.data.emails = [];
    }
    state.value.data.emails.push({
      email: '',
    });
  }
};
const removeEmail = (emailRow: type_ens_members_mail) => {
  if (state.value.data) {
    state.value.data.emails = state.value.data.emails?.filter(x => x !== emailRow);
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
        Emails:
        <UButton
          icon="i-heroicons-plus-circle"
          variant="ghost"
          color="gray"
          @click="addMail" />
      </div>
    </div>
    <ul
      v-if="state.data.emails?.length"
      role="list">
      <li
        v-for="(row, index) in state.data.emails"
        :key="index"
        class="flex items-center justify-between gap-3 py-3">
        <div class="w-full text-left">
          <span class="flex gap-x-3">
            <UButton
              icon="i-heroicons-trash"
              variant="ghost"
              color="gray"
              @click="removeEmail(row)" />
            <UInput
              v-model:model-value="row.email"
              placeholder="Correo electrónico"
              class="w-full"
              :size="inputSize"
              :loading="state.isLoading" />
          </span>
        </div>
      </li>
    </ul>
    <div
      v-else
      class="m-2 text-sm text-gray-500 dark:text-gray-400">
      No hay emails registrados
      <UIcon name="i-heroicons-face-frown" />
    </div>
  </div>
</template>