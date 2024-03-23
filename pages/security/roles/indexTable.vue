<script setup lang="ts">
import { columns } from './config'
import { type type_sys_profiles } from '@/types/server/sys_profiles'
import { format, isToday } from 'date-fns'

defineProps({
  rows: {
    type: Array<type_sys_profiles>,
    required: false,
    default: () => []
  }
})
</script>

<template>
  <UTable
    :rows="rows"
    :columns="columns"
    :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
    sort-mode="manual"
    class="w-full hidden sm:block"
  >
    <template #name_es-data="{ row }: { row: type_sys_profiles }">
      <div class="flex items-center gap-3">
        <UAvatar size="xs">
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
        :color="row.is_active ? 'green' : 'red'"
        variant="subtle"
        class="capitalize"
      />
    </template>
    <template #updated_at-data="{ row }">
      <div class="text-sm font-light dark:text-white text-black">
        {{ isToday(new Date(row.updated_at!)) ? format(new Date(row.updated_at!), 'HH:mm') : format(new Date(row.updated_at!), 'dd MMM') }}
      </div>
    </template>
    <template #actions-data="{ row }: { row: type_sys_profiles }">
      <UButton
        icon="i-heroicons-pencil-square"
        variant="link"
        color="gray"
        @click="navigateTo(`/security/roles/${row.id}`)" />
    </template>
  </UTable>
</template>