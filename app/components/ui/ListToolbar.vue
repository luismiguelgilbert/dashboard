<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core';

const searchString = defineModel<string>('searchString', { default: '', required: true })
const sortBy = defineModel<string>('sortBy', { default: undefined, required: true })
const sortByOrder = defineModel<sys_sortbyorder>('sortByOrder', { default: 'asc', required: true })
const props = defineProps<{
  sortItems: sort_by_options[],
  canCreate?: boolean,
  canDownload?: boolean,
}>();
const emits = defineEmits(['download-file', 'open-new', 'invalidate-cache']);

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('lg');
const isOpen = ref<boolean>(false);
</script>

<template>
  <UButtonGroup size="xl">
    <UButton
      class="cursor-pointer"
      color="neutral"
      variant="subtle"
      :disabled="!props.canCreate"
      @click="emits('open-new')">
      <template #default>
        <UIcon name="i-lucide-circle-plus" size="30" />
        <span class="hidden sm:inline-block">Nuevo</span>
      </template>
    </UButton>
    <UDrawer
      v-model:open="isOpen"
      title="Opciones"
      description="Buscar, ordenar y filtrar la lista"
      :direction="isMobile ? 'top' : 'right'">
      <template #header>
        <div class="flex items-center justify-between pt-safe">
          <h2 class="text-lg font-semibold">
            Opciones
          </h2>
          <UButton
            class="cursor-pointer"
            icon="i-lucide-x"
            size="xl"
            color="neutral"
            variant="soft"
            @click="isOpen = false" />
        </div>
        <p class="text-sm text-gray-500">
          Buscar, ordenar y filtrar la lista
        </p>
      </template>
      <UButton
        class="cursor-pointer"
        color="neutral"
        variant="outline"
        @click="isOpen = true">
        <template #default>
          <UIcon name="i-lucide-search" size="30" />
          <span class="hidden sm:inline-block font-semibold w-20 overflow-x-hidden text-ellipsis">
            {{ searchString.length > 0 ? `${searchString}` : 'Opciones' }}
          </span>
        </template>
      </UButton>

      <template #body>
        <div class="w-full grid grid-cols-1 gap-y-2">
          <UiDebouncedSearchInput
            v-model="searchString"
            size="xl"
            placeholder="Buscar..." />
          <UButton
            class="cursor-pointer !rounded-md"
            label="Descargar lista"
            color="neutral"
            icon="i-lucide-file-spreadsheet"
            size="xl"
            variant="subtle"
            :disabled="!props.canDownload"
            @click="emits('download-file')" />
          <UButton
            class="cursor-pointer !rounded-md"
            label="Recargar lista"
            color="neutral"
            icon="i-lucide-database-backup"
            size="xl"
            variant="subtle"
            @click="emits('invalidate-cache')" />
          <UPageCard variant="soft">
            <template #header>
              <h3 class="text-lg font-semibold">
                Ordenar lista:
              </h3>
              <URadioGroup
                v-model="sortByOrder"
                class="cursor-pointer"
                value-key="id"
                size="xl"
                :items="[
                  { id: 'asc', label: 'Ascendente   ⬇️' },
                  { id: 'desc', label: 'Descendente ⬆️' }
                ]" />
              <h3 class="pt-3 text-lg font-semibold">
                Campo:
              </h3>
              <URadioGroup
                v-model="sortBy"
                class="cursor-pointer"
                value-key="id"
                size="xl"
                :items="props.sortItems" />
            </template>
          </UPageCard>
          <slot name="FilterSection" />
        </div>
      </template>
    </UDrawer>
  </UButtonGroup>
</template>
