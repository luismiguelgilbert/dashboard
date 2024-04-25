<script setup lang="ts">
import { columns } from './config'
import { type type_ens_members } from '@/types/server/ens_types'
import { format, isToday } from 'date-fns'

defineProps({
  rows: {
    type: Array<type_ens_members>,
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
    <template #name_es-data="{ row }: { row: type_ens_members }">
      <div class="flex items-center gap-3">
        <NuxtImg 
          v-if="row.avatar_url && row.avatar_url.length > 0"
          :src="row.avatar_url"
          width="30"
          height="25"
          class="ml-1 mt-1 rounded" />
        <UAvatar
          v-else
          size="xs">
          {{ row.user_full_name[0] }}
        </UAvatar>
        <div class="text-base font-semibold dark:text-white text-black">
          {{ `${row.user_full_name}` }}
          <p class="font-light">{{ row.email }}</p>
        </div>
      </div>
    </template>
    <template #is_active-data="{ row }: { row: type_ens_members }">
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
    <template #actions-data="{ row }: { row: type_ens_members }">
      <UButton
        icon="i-heroicons-pencil-square"
        variant="link"
        color="gray"
        @click="navigateTo(`/security/roles/${row.id}`)" />
    </template>
  </UTable>
</template>