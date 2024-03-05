<script setup lang="ts">
import { type FilterOption } from '~/types/client';

defineProps({
  placeholder: {
    type: String,
    required: false,
    default: 'Buscar...'
  },
  filterOptions: {
    type: Array<FilterOption>,
    required: false,
    default: () => []
  },
  sortOptions: {
    type: Array<FilterOption>,
    required: false,
    default: () => []
  }
});

defineShortcuts({
  '/': () => { input.value?.input?.focus() }
})
const searchString = defineModel<string>('searchString', { default: '' });
const page = defineModel<number>('page', { default: 1 });
const filterBy = defineModel<number[]>('filterBy', { default: [] });
const sortBy = defineModel<number>('sortBy', { default: 1 });

const input = ref<{ input: HTMLInputElement }>();

const updatePropSearchString = useDebounceFn((inputEvent: InputEvent) => {
  page.value = 1;
  searchString.value = (inputEvent.target as HTMLInputElement).value ?? '';
}, 1000);
</script>

<template>
  <UInput
    ref="input"
    :model-value="searchString"
    icon="i-heroicons-magnifying-glass"
    autocomplete="off"
    :placeholder="placeholder"
    @input="updatePropSearchString" />
  <USelectMenu
    v-if="filterOptions.length > 1"
    v-model="filterBy"
    icon="i-heroicons-funnel"
    placeholder="Todos"
    value-attribute="value"
    multiple
    :options="filterOptions"
    :ui-menu="{ option: { base: 'capitalize' } }"
    @change="() => { page = 1 }">
    <template #label>
      <span>Filtros</span>
    </template>
  </USelectMenu>
  <USelectMenu
    v-model="sortBy"
    value-attribute="value"
    :options="sortOptions">
    <template #label>
      <span>Orden</span>
    </template>
  </USelectMenu>
</template>