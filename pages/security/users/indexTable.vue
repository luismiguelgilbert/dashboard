<script setup lang="ts">
import { columns, rowActions } from './config';
import { type type_sys_users } from '@/types/server/sys_users';

defineProps({
  rows: {
    type: Array<type_sys_users>,
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
    <template #id-data="{ row }: { row: type_sys_users }">
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
          {{ row.user_name[0] }}
        </UAvatar>
        <div class="text-base font-semibold dark:text-white text-black">
          {{ `${row.user_name} ${row.user_lastname}` }}
        </div>
      </div>
    </template>
    <template #actions-data="{ row }">
      <UDropdown :items="rowActions(row)">
        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
      </UDropdown>
    </template>
  </UTable>
</template>