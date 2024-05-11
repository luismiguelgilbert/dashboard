<script setup lang="ts">
import { columns } from './config';
import { type type_sys_users } from '@/types/server/sys_users';

const props = defineProps({
  rows: {
    type: Array<type_sys_users>,
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
    :rows="props.rows"
    :columns="columns"
    :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
    :progress="{color: 'primary', animation: 'carousel'}"
    :loading="props.loading"
    sort-mode="manual"
    class="w-full hidden sm:block h-dvh">
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
    <template #actions-data="{ row }: { row: type_sys_users }">
      <UButton
        icon="i-heroicons-pencil-square"
        variant="link"
        size="xl"
        class="text-primary-400 dark:text-primary-400"
        @click="navigateTo(`/security/users/${row.id}`)" />
    </template>
  </UTable>
</template>