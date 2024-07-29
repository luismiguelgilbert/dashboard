<script setup lang="ts">
import { format } from 'date-fns';
// import { fromZonedTime } from 'date-fns-tz';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { ens_members } from '@/types/server/ens/ens_members';
import BasicPhones from './basicPhones.vue';
import BasicMails from './basicMails.vue';
import BasicAddresses from './basicAddresses.vue';

const { state } = useEnsEquipistasForm();
const isMobile = useBreakpoints(breakpointsTailwind).smaller('sm');
const inputSize = computed(() => isMobile.value ? 'lg' : 'xl');
const inputUI = { icon: { leading: { wrapper: 'content-start items-start pt-2.5' }, base: 'text-gray-400' } };

const { data: members, pending: membersPending } = await useLazyFetch('/api/lookups/ens/ens_members');
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
          Nombre del Equipista:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Proviene del usuario del sistema.
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="name_es">
        <UInput
          v-model:model-value="state.data.user_name"
          required
          disabled
          placeholder="Nombre del equipo"
          icon="i-heroicons-identification"
          :ui="inputUI"
          :loading="state.isLoading" />
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Apellidos:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Proviene del usuario del sistema.
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="user_lastname">
        <UInput
          v-model:model-value="state.data.user_lastname"
          required
          disabled
          placeholder="Apellidos del Usuario"
          icon="i-heroicons-user"
          :ui="inputUI"
          :loading="state.isLoading" />
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Es consiliario
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ `${state.data.es_consiliario ? 'Consiliario' : 'Equipista'}` }}
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="is_active">
        <UToggle
          v-model="state.data.es_consiliario"
          :disabled="state.isLoading" />
        <span
          class="ml-5"
          style="vertical-align: text-bottom;">{{ state.data.es_consiliario ? 'Consiliario' : 'Equipista' }}</span>
      </UFormGroup>

      <UDivider
        v-if="!state.data.es_consiliario"
        class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div v-if="!state.data.es_consiliario">
        <p class="text-gray-900 dark:text-white font-semibold">
          Esposo/Esposa:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Cónyuge del equipista.
        </p>
      </div>
      <UFormGroup
        v-if="!state.data.es_consiliario"
        :size="inputSize"
        name="sys_profile_id">
        <USelectMenu
          v-model="state.data.partner_id"
          searchable
          required
          searchable-placeholder="Buscar equipista..."
          placeholder="Seleccionar equipista..."
          icon="i-hugeicons-favourite"
          value-attribute="id"
          option-attribute="full_name"
          :loading="state.isLoading || membersPending"
          :options="members ?? []" />
      </UFormGroup>
      
      <UDivider
        class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          {{ `Fecha de ${state.data.es_consiliario ? 'Ordenación sacerdotal' : 'Matrimonio'}:` }}
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ `Fecha de ${state.data.es_consiliario ? 'Ordenación sacerdotal' : 'Matrimonio eclesiástico'}:` }}
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="nivel_0">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UInput
            :value="format(state.data.fecha_matrimonio!, 'd MMM y')"
            required
            placeholder="Fecha"
            icon="i-hugeicons-church"
            class="w-full"
            readonly
            :ui="inputUI"
            :loading="state.isLoading" />
          <template #panel="{ close }">
            <DatePicker
              v-if="state.data && state.data.fecha_matrimonio"
              v-model="state.data.fecha_matrimonio"
              is-required
              :timezone="'UTC'"
              @close="close"
              @update:model-value="(value) => {
                if (state.data?.fecha_matrimonio) {
                  state.data.fecha_matrimonio = value.toISOString();
                }
              }" />
          </template>
        </UPopover>
      </UFormGroup>

      <UDivider
        class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Fecha de Nacimiento
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Se utiliza para cumpleaños.
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="nivel_0">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UInput
            :value="format(state.data.fecha_nacimiento!, 'dd MMM y')"
            required
            placeholder="Fecha"
            icon="i-hugeicons-church"
            class="w-full"
            readonly
            :ui="inputUI"
            :loading="state.isLoading" />
          <template #panel="{ close }">
            <DatePicker
              v-if="state.data && state.data.fecha_nacimiento"
              v-model="state.data.fecha_nacimiento"
              is-required
              :timezone="'UTC'"
              @close="close"
              @update:model-value="(value) => {
                if (state.data?.fecha_nacimiento) {
                  state.data.fecha_nacimiento = value.toISOString();
                }
              }" />
          </template>
        </UPopover>
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Estado:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Estado del equipista en el movimiento.
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

      <BasicPhones />
      <BasicAddresses />
      <BasicMails />

      <br /><br />
    </div>
  </UForm>
</template>