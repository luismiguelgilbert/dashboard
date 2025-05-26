<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core';

const searchString = defineModel<string>('searchString', { default: '', required: true })
const sortBy = defineModel<string>('sortBy', { default: undefined, required: true })
const props = defineProps<{
  sortItems: sort_by_options[],
}>();
const emits = defineEmits(['download-file', 'open-new']);

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('lg');
const isOpen = ref<boolean>(false);
</script>

<template>
  <UButtonGroup>
    <UButton
      class="cursor-pointer"
      color="neutral"
      variant="subtle"
      size="xl"
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
            color="neutral"
            icon="i-lucide-circle-x"
            variant="ghost"
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
          <span class="hidden sm:inline-block font-semibold">Opciones</span>
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
            label="Descargar"
            color="neutral"
            icon="i-lucide-file-spreadsheet"
            size="xl"
            variant="subtle"
            @click="emits('download-file')" />
          <UPageCard
            title="Ordenar lista:"
            variant="soft">
            <template #footer>
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
