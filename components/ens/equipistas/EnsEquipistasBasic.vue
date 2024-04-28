<script setup lang="ts">
import { type type_ens_members_lookup } from '@/types/server/ens_types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'

const { state } = useEnsEquipistasForm();
const inputUI = { icon: { leading: { wrapper: 'content-start items-start pt-2.5' }, base: 'text-gray-400' } };

//COMPUTED PROPS
const partnerAvatar = computed(() => state.value.data.partner_id && state.value.equipistas.find(equipista => equipista.id === state.value.data.partner_id)?.avatar_url);

//LOOKUP DATA
const { data } = useFetch<type_ens_members_lookup[]>('/api/lookups/ens_members');
state.value.equipistas = data.value ?? [];
</script>

<template>
  <UDashboardCard
    class="col-span-2 mx-3 mt-5"
    :title="`${state.data.user_full_name}`"
    :description="state.data.email"
    icon="i-heroicons-chart-bar">
    <template #icon>
      <UAvatar :src="state.data.avatar_url!" :alt="state.data.user_full_name" size="lg" />
    </template>
    <template #title>
      <div class="text-base font-bold dark:text-white text-black">
        {{ `${state.data.user_full_name}` }}
        <font-awesome-icon v-if="state.data.user_sex" icon="fa-solid fa-person" class="text-emerald-500" />
        <font-awesome-icon v-if="!state.data.user_sex" icon="fa-solid fa-person-dress" class="text-rose-500" />
      </div>
    </template>
  </UDashboardCard>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-2 sm:px-4 content-start">
    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Cónyuge:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Cónyuge del equipista.
      </p>
    </div>
    <UFormGroup name="partner_id">
      <USelectMenu
        v-model="state.data.partner_id"
        searchable-placeholder="Buscar equipista..."
        placeholder="Seleccionar equipista..."
        size="xl"
        icon="i-heroicons-user-circle"
        searchable
        value-attribute="id"
        option-attribute="user_full_name"
        :options="state.equipistas">
        <template #leading>
          <UAvatar v-if="partnerAvatar" :src="partnerAvatar" size="2xs" />
          <UIcon v-else name="i-heroicons-user-circle" class="w-5 h-5" />
        </template>
        <template #option="{ option: person }">
          <UAvatar v-if="person.avatar_url" :src="person.avatar_url" size="2xs" />
          <UIcon v-else name="i-heroicons-user-circle" class="w-5 h-5" />
          <span>{{ person.user_full_name }}</span>
        </template>
      </USelectMenu>
    </UFormGroup>

    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Matrimonio:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Fecha de Matrimonio.
      </p>
    </div>
    <UPopover :popper="{ placement: 'bottom-start' }" class="w-full">
      <UInput
        :value="state.data.fecha_matrimonio ? format(state.data.fecha_matrimonio, 'd MMM, yyy', { locale: es }) : undefined"
        class="w-full"
        required
        label="Código"
        size="xl"
        readonly
        placeholder="ID del Usuario"
        icon="i-heroicons-calendar-days"
        :ui="inputUI"
        :loading="state.isLoading" />
      <template #panel="{ close }">
        <DatePicker v-model="state.data.fecha_matrimonio" is-required @close="close" />
      </template>
    </UPopover>

    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Cumpleaños:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Fecha de Nacimiento.
      </p>
    </div>
    <UPopover :popper="{ placement: 'bottom-start' }" class="w-full">
      <UInput
        :value="state.data.fecha_nacimiento ? format(state.data.fecha_nacimiento, 'd MMM, yyy', { locale: es }) : undefined"
        class="w-full"
        required
        label="Código"
        size="xl"
        readonly
        placeholder="ID del Usuario"
        icon="i-heroicons-calendar-days"
        :ui="inputUI"
        :loading="state.isLoading" />
      <template #panel="{ close }">
        <DatePicker v-model="state.data.fecha_nacimiento" is-required @close="close" />
      </template>
    </UPopover>

    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Activo:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Estado del equipista.
      </p>
    </div>
    <UFormGroup name="user_sex">
      <UToggle
        v-model="state.data.is_active"
        :disabled="state.isLoading" />
      <span class="ml-5" style="vertical-align: text-bottom;">{{ state.data.is_active ? 'Activo' : 'Inactivo' }}</span>
    </UFormGroup>

  </div>
  <br /> <br />
</template>