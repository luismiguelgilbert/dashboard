<script setup lang="ts">
import { columns } from './config';
import { type type_sys_users } from '@/types/server/sys_users';
import { format, isToday } from 'date-fns';

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
  <!-- :loading="props.loading" -->
  <UTable
    :rows="props.rows"
    :columns="columns"
    :ui="{ 
      th: { base: 'sticky top-0 z-10 bg-white dark:bg-gray-900' },
      divide: 'divide-gray-200 dark:divide-gray-800',
    }"
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
          <font-awesome-icon
            v-if="row.user_sex"
            icon="fa-solid fa-person"
            class="text-emerald-500" />
          <font-awesome-icon
            v-if="!row.user_sex"
            icon="fa-solid fa-person-dress"
            class="text-rose-300" />
        </div>
      </div>
    </template>
    <template #last_sign_in_at-data="{ row }: { row: type_sys_users }">
      {{ (row.last_sign_in_at) ? isToday(new Date(row.last_sign_in_at))
        ? `Hoy ${format(new Date(row.last_sign_in_at), 'HH:mm')}`
        : format(new Date(row.last_sign_in_at), 'dd MMM yyyy') : '' }}
    </template>
    <template #actions-data="{ row }: { row: type_sys_users }">
      <UButton
        variant="link"
        size="xl"
        class="text-primary-400 dark:text-primary-400"
        @click="navigateTo(`/security/users/${row.id}`)">
        <font-awesome-icon
          icon="fa-solid fa-square-pen"
          size="lg" />
      </UButton>
    </template>
  </UTable>
</template>