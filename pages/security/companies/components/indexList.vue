<script setup lang="ts">
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
  <div class="w-full block sm:hidden">
    <ul
      role="list"
      class="divide-y divide-gray-200 dark:divide-gray-800">
      <li
        v-for="(row, index) in rows"
        :key="index"
        class="flex justify-between gap-x-6 py-2">
        <div class="flex min-w-0 gap-x-4">
          <div class="pl-2">
            <NuxtImg 
              v-if="row.avatar_url && row.avatar_url.length > 0"
              :src="row.avatar_url"
              width="15"
              height="15"
              class="ml-2 mt-1 rounded" />
            <UAvatar
              v-else-if="row.name_es_short"
              size="xs">
              {{ row.name_es_short[0] }}
            </UAvatar>
          </div>
          <div class="min-w-0 flex-auto">
            <p class="text-sm font-semibold leading-6">
              {{ row.name_es_short }}
            </p>
            <p class="mt-1 truncate text-xs leading-5 text-gray-500">
              {{ row.name_es }}
            </p>
            <p class="mt-1 truncate text-xs leading-5 text-gray-500">
              {{ row.company_number }}
            </p>
            <UButton
              :label="row.is_active? 'activo' : 'inactivo'"
              :color="row.is_active ? 'green' : 'red'"
              variant="link"
              class="capitalize p-0" />
          </div>
        </div>
        <UButton
          variant="link"
          size="xl"
          class="text-primary-400 dark:text-primary-400"
          @click="navigateTo(`/security/companies/${row.id}`)">
          <font-awesome-icon
            icon="fa-solid fa-square-pen"
            size="lg" />
        </UButton>
      </li>
    </ul>
  </div>
</template>