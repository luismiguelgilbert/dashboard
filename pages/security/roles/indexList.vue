<script setup lang="ts">
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
  <div class="w-full block sm:hidden">
    <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-800">
      <li
        v-for="(row, index) in rows"
        :key="index"
        class="grid grid-cols-1 gap-x-6 p-4">
        <div class="flex min-w-0 gap-x-2">
          <UAvatar size="xs">
            {{ row.name_es[0] }}
          </UAvatar>
          <p class="text-sm font-semibold leading-6 whitespace-normal break-all mr-2">
            {{ row.name_es }}
          </p>
        </div>
        <div class="grid grid-co1">
            <p class="mt-1 truncate text-xs leading-5 text-gray-500">
              Usuarios: {{ row.row_count }}
            </p>
            <p class="mt-1 truncate text-xs leading-5 text-gray-500">
              Creado: {{ isToday(new Date(row.created_at!)) ? format(new Date(row.created_at!), 'HH:mm') : format(new Date(row.created_at!), 'dd MMM') }}
              / Actualizado: {{ isToday(new Date(row.updated_at!)) ? format(new Date(row.updated_at!), 'HH:mm') : format(new Date(row.updated_at!), 'dd MMM') }}
            </p>
            <UButton
              :label="row.is_active? 'activo' : 'inactivo'"
              :color="row.is_active ? 'green' : 'red'"
              variant="link"
              class="capitalize p-0" />
        </div>
      </li>
    </ul>
  </div>
</template>