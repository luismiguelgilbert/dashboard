<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { sys_roles } from '@/types/server/security/sys_roles';
import BasicPermissions from './basicPermissions.vue';

const { state } = useSecurityRolesForm();
const isMobile = useBreakpoints(breakpointsTailwind).smaller('sm');
const inputSize = computed(() => isMobile.value ? 'lg' : 'xl');
const inputUI = { icon: { leading: { wrapper: 'content-start items-start pt-2.5' }, base: 'text-gray-400' } };
</script>

<template>
  <UForm
    v-if="state.data"
    ref="form"
    class="pl-6 pr-6 md:pl-2 md:pr-2 pt-4 md:pt-0"
    :schema="sys_roles"
    :state="state.data">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-2 sm:px-4 content-start">
      <div class="col-span-1 sm:col-span-2 pt-1" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Nombre:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Nombre del Perfil
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="name_es">
        <UInput
          v-model:model-value="state.data.name_es"
          required
          placeholder="Nombre del servicio"
          icon="i-heroicons-identification"
          :ui="inputUI"
          :loading="state.isLoading" />
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Estado:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Estado del perfil.
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="is_active">
        <UToggle
          v-model="state.data.is_active"
          :disabled="state.isLoading" />
        <span
          class="ml-5"
          style="vertical-align: text-bottom;">{{ state.data.is_active ? 'Activo' : 'Inactivo' }}</span>
      </UFormGroup>
    </div>
    <br />
    <div class="my-10 sm:my-0 mx-5">
      <UDivider />
      <BasicPermissions />
    </div>
    <br /><br />
  </UForm>
</template>