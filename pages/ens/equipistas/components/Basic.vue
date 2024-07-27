<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { ens_members } from '@/types/server/ens/ens_members';

const { state } = useEnsEquipistasForm();
const isMobile = useBreakpoints(breakpointsTailwind).smaller('sm');
const inputSize = computed(() => isMobile.value ? 'lg' : 'xl');
const inputUI = { icon: { leading: { wrapper: 'content-start items-start pt-2.5' }, base: 'text-gray-400' } };
</script>

<template>
  <UForm
    v-if="state.data"
    ref="form"
    class="pl-6 pr-6 md:pl-2 md:pr-2 pt-4 md:pt-0"
    :schema="ens_members"
    :state="state.data">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-2 sm:px-4 content-start">
      <div class="col-span-1 sm:col-span-2 pt-1" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Nombre del Libro:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Usar Título únicamente.
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="name_es">
        <UInput
          v-model:model-value="state.data.user_name"
          required
          placeholder="Nombre del equipo"
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
      
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Comentario:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Comentarios adicionales (ej: año de publicación)
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="nivel_0">
        <UInput
          v-model:model-value="state.data.user_lastname"
          required
          placeholder="Ciudad a la que pertenece el equipo"
          icon="i-heroicons-map"
          :ui="inputUI"
          :loading="state.isLoading" />
      </UFormGroup>

      <br /><br />
    </div>
  </UForm>
</template>