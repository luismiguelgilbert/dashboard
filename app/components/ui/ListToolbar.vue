<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core';

const search = defineModel<string | undefined>('search');
const sort = defineModel<string>('sort', { default: '1' });
const order = defineModel<string>('order', { default: 'asc' });

const props = defineProps<{
  sortItems: sort_by_options[],
  canCreate?: boolean,
  canDownload?: boolean,
}>();
const emits = defineEmits(['download-file', 'open-new', 'invalidate-cache']);

const { currentRoute, push } = useRouter();
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
      :overlay="false"
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
          <span
            class="hidden sm:inline-block font-semibold w-20 overflow-x-hidden text-ellipsis text-left"
            :class="{ 'text-primary-400': (search && search.length > 0) }">
            {{ search && search.length > 0 ? `${search}` : 'Opciones' }}
          </span>
        </template>
      </UButton>

      <template #body>
        <div class="w-full grid grid-cols-1 gap-y-2 min-w-full sm:min-w-[350px]">
          <UFormField size="xl">
            <UiDebouncedSearchInput
              v-model="search"
              size="xl"
              placeholder="Buscar..."
              @update:model-value="val => push({ query: { ...currentRoute.query, search: val || undefined } })" />
          </UFormField>
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

          <UPageCard variant="soft" class="my-2">
            <UFormField label="Ordenar lista:" size="xl">
              <URadioGroup
                v-model="order"
                value-key="id"
                size="xl"
                :ui="{ base: 'cursor-pointer hover:bg-primary-500', label: 'cursor-pointer', description: 'cursor-pointer' }"
                :items="[
                  { id: 'asc', label: 'Ascendente   ⬇️' },
                  { id: 'desc', label: 'Descendente ⬆️' }
                ]"
                @update:model-value="val => push({ query: { ...currentRoute.query, order: val || undefined } })" />
            </UFormField>
            <UFormField label="Campo:" size="xl">
              <USelectMenu
                v-model="sort"
                value-key="id"
                size="xl"
                class="w-full"
                :search-input="false"
                :items="props.sortItems"
                @update:model-value="val => push({ query: { ...currentRoute.query, sort: val || undefined } })" />
            </UFormField>
          </UPageCard>

          <UPageCard
            variant="soft"
            class="my-2">
            <UFormField label="Filtrar lista:" size="xl" />
            <slot name="FilterSection" />
          </UPageCard>
        </div>
      </template>
    </UDrawer>
  </UButtonGroup>
</template>
