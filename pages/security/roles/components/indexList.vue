<script setup lang="ts">
import { type type_sys_profiles } from '@/types/server/sys_profiles';
import { format, isToday } from 'date-fns';

defineProps({
  rows: {
    type: Array<type_sys_profiles>,
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
            <UAvatar size="xs">
              {{ row.name_es[0] }}
            </UAvatar>
          </div>
          <div class="min-w-0 flex-auto">
            <p class="text-sm truncate font-semibold leading-6">
              {{ row.name_es }}
            </p>
            <p class="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-gray-300">
              Usuarios: {{ row.user_count }}
            </p>
            <p class="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-gray-300">
              Creado: {{ isToday(new Date(row.created_at!)) ? format(new Date(row.created_at!), 'HH:mm') : format(new Date(row.created_at!), 'dd MMM') }}
              / Actualizado: {{ isToday(new Date(row.updated_at!)) ? format(new Date(row.updated_at!), 'HH:mm') : format(new Date(row.updated_at!), 'dd MMM') }}
            </p>
            <UButton
              :label="row.is_active? 'activo' : 'inactivo'"
              :color="row.is_active ? 'primary' : 'red'"
              variant="link"
              class="capitalize p-0" />
          </div>
        </div>
        <UButton
          variant="link"
          size="xl"
          class="text-primary-400 dark:text-primary-400"
          @click="navigateTo(`/security/roles/${row.id}`)">
          <font-awesome-icon
            icon="fa-solid fa-square-pen"
            size="lg" />
        </UButton>
      </li>
    </ul>
  </div>
</template>