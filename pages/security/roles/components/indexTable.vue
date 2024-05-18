<script setup lang="ts">
import { columns } from './config';
import { type type_sys_profiles } from '@/types/server/sys_profiles';
import { format, isToday } from 'date-fns';

const props = defineProps({
  rows: {
    type: Array<type_sys_profiles>,
    required: false,
    default: () => []
  }
});
</script>

<template>
  <UTable
    :rows="props.rows"
    :columns="columns"
    :ui="{ 
      th: { base: 'sticky top-0 z-10 bg-white dark:bg-gray-900' },
      divide: 'divide-gray-200 dark:divide-gray-800',
    }"
    sort-mode="manual"
    class="w-full hidden sm:block h-dvh">
    <template #name_es-data="{ row }: { row: type_sys_profiles }">
      <div class="flex items-center gap-3">
        <UAvatar
          v-if="row.name_es"
          size="xs">
          {{ row.name_es[0] }}
        </UAvatar>
        <div class="text-base font-semibold dark:text-white text-black">
          {{ `${row.name_es}` }}
        </div>
      </div>
    </template>
    <template #is_active-data="{ row }: { row: type_sys_profiles }">
      <UBadge
        :label="row.is_active? 'activo' : 'inactivo'"
        :color="row.is_active ? 'primary' : 'red'"
        variant="soft"
        class="capitalize"
      />
    </template>
    <template #updated_at-data="{ row }: { row: type_sys_profiles }">
      {{ (row.updated_at) ? isToday(new Date(row.updated_at))
        ? `Hoy ${format(new Date(row.updated_at), 'HH:mm')}`
        : format(new Date(row.updated_at), 'dd MMM yyyy') : '' }}
    </template>
    <template #actions-data="{ row }: { row: type_sys_profiles }">
      <UButton
        variant="link"
        size="xl"
        class="text-primary-400 dark:text-primary-400"
        @click="navigateTo(`/security/roles/${row.id}`)">
        <font-awesome-icon
          icon="fa-solid fa-square-pen"
          size="lg" />
      </UButton>
    </template>
  </UTable>
</template>