<script setup lang="ts">
import { columns } from './config';
import { type type_sys_companies } from '@/types/server/sys_companies';

defineProps({
  rows: {
    type: Array<type_sys_companies>,
    required: false,
    default: () => []
  }
});
</script>

<template>
  <UTable
    :rows="rows"
    :columns="columns"
    :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
    sort-mode="manual"
    class="w-full hidden sm:block"
  >
    <template #id-data="{ row }: { row: type_sys_companies }">
      <div class="flex items-center gap-3">
        <NuxtImg 
          v-if="row.avatar_url && row.avatar_url.length > 0"
          :src="row.avatar_url"
          width="20"
          height="15"
          class="ml-1 mt-1 rounded" />
        <UAvatar
          v-else
          size="xs">
          {{ row.name_es_short[0] }}
        </UAvatar>
        <div class="text-base font-semibold dark:text-white text-black">
          {{ row.name_es_short }}
        </div>
      </div>
    </template>
    <template #is_active-data="{ row }: { row: type_sys_companies }">
      <UBadge
        :label="row.is_active? 'activo' : 'inactivo'"
        :color="row.is_active ? 'green' : 'red'"
        variant="soft"
        class="capitalize"
      />
    </template>
    <template #actions-data="{ row }: { row: type_sys_companies }">
      <UButton
        icon="i-heroicons-pencil-square"
        variant="link"
        color="gray"
        @click="navigateTo(`/security/users/${row.id}`)" />
    </template>
  </UTable>
</template>