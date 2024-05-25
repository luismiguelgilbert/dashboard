<script setup lang="ts">
import { columns } from './config';
import { type type_ens_members } from '@/types/server/ens_types';
import { format, isToday } from 'date-fns';

const props = defineProps({
  rows: {
    type: Array<type_ens_members>,
    required: false,
    default: () => []
  },
  loading: {
    type: Boolean,
    required: false,
    default: false
  },
});
</script>

<template>
  <UTable
    :rows="rows"
    :columns="columns"
    :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
    :loading="props.loading"
    sort-mode="manual"
    class="w-full hidden sm:block h-dvh">
    <template #name_es-data="{ row }: { row: type_ens_members }">
      <div class="flex items-center gap-3">
        <NuxtImg 
          v-if="row.avatar_url && row.avatar_url.length > 0"
          :src="row.avatar_url"
          width="40"
          height="35"
          class="ml-1 mt-1 rounded" />
        <UAvatar
          v-else
          size="xs">
          {{ row.user_full_name[0] }}
        </UAvatar>
        <div class="text-base font-bold dark:text-white text-black">
          {{ `${row.user_full_name}` }}
          <font-awesome-icon
            v-if="!row.es_consiliario && row.user_sex"
            icon="fa-solid fa-person"
            class="text-emerald-500" />
          <font-awesome-icon
            v-if="!row.es_consiliario && !row.user_sex"
            icon="fa-solid fa-person-dress"
            class="text-rose-500" />
          <font-awesome-icon
            v-if="row.es_consiliario"
            icon="fa-solid fa-person-praying" />
          <p class="font-thin text-base">
            {{ row.email }}
          </p>
        </div>
      </div>
    </template>
    <template #is_active-data="{ row }: { row: type_ens_members }">
      <UBadge
        :label="row.is_active? 'activo' : 'inactivo'"
        :color="row.is_active ? 'primary' : 'red'"
        variant="subtle"
        class="capitalize"
      />
    </template>
    <template #updated_at-data="{ row }">
      <div class="text-sm font-light dark:text-white text-black">
        {{ isToday(new Date(row.updated_at!)) ? format(new Date(row.updated_at!), 'HH:mm') : format(new Date(row.updated_at!), 'dd MMM') }}
      </div>
    </template>
    <template #actions-data="{ row }: { row: type_ens_members }">
      <UButton
        variant="link"
        size="xl"
        class="text-primary-400 dark:text-primary-400"
        @click="navigateTo(`/ens/equipistas/${row.id}`)">
        <font-awesome-icon
          icon="fa-solid fa-square-pen"
          size="lg" />
      </UButton>
    </template>
  </UTable>
</template>