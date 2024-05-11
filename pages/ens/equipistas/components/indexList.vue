<script setup lang="ts">
import { type type_ens_members } from '@/types/server/ens_types';
import { format, isToday } from 'date-fns';

defineProps({
  rows: {
    type: Array<type_ens_members>,
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
        class="flex justify-between gap-x-6 py-5">
        <div class="flex min-w-0 gap-x-4">
          <div class="pl-2">
            <NuxtImg 
              v-if="row.avatar_url && row.avatar_url.length > 0"
              :src="row.avatar_url"
              width="15"
              height="15"
              class="ml-2 mt-1 rounded" />
            <UAvatar
              v-else
              size="xs">
              {{ row.user_full_name[0] }}
            </UAvatar>
          </div>
          <div class="min-w-0 flex-auto">
            <p class="text-sm truncate font-semibold leading-6">
              {{ row.user_full_name }}
              <font-awesome-icon
                v-if="!row.es_consiliario && row.user_sex"
                icon="fa-solid fa-person"
                class="text-emerald-500" />
              <font-awesome-icon
                v-if="!row.es_consiliario && !row.user_sex"
                icon="fa-solid fa-person-dress"
                class="text-rose-500" />
              <font-awesome-icon
                v-if="row.es_consiliario"
                icon="fa-solid fa-person-praying" />
            </p>
            <p class="mt-1 truncate text-xs leading-5 text-gray-500">
              {{ row.email }}
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
        </div>
        
        <UButton
          class="ml-2"
          icon="i-heroicons-pencil-square"
          variant="link"
          color="gray"
          @click="navigateTo(`/ens/equipistas/${row.id}`)" />
      </li>
    </ul>
  </div>
</template>