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
const searchString = defineModel<string>("searchString", { default: '' });
const page = defineModel<number>("page", { default: 1 });
const filterBy = defineModel<number[]>("filterBy", { default: [] });
const sortBy = defineModel<number>("sortBy", { default: 1 });

const input = ref<{ input: HTMLInputElement }>();

const updatePropSearchString = useDebounceFn((inputEvent: InputEvent) => {
  page.value = 1;
  searchString.value = (inputEvent.target as HTMLInputElement).value ?? '';
}, 1000);
</script>

<template>
  <!--Input For Search-->
  <UInput
    ref="input"
    :model-value="searchString"
    icon="i-heroicons-magnifying-glass"
    autocomplete="off"
    class="hidden sm:block"
    :placeholder="placeholder"
    @keydown.esc="$event.target.blur()"
    @input="updatePropSearchString"
  >
    <template #trailing>
      <UKbd value="/" />
    </template>
  </UInput>
  <!--Select for Filter-->
  <USelectMenu
    v-if="filterOptions.length > 1"
    v-model="filterBy"
    class="hidden lg:block"
    icon="i-heroicons-funnel"
    placeholder="Todos"
    value-attribute="value"
    multiple
    :options="filterOptions"
    :ui-menu="{ option: { base: 'capitalize' } }"
    @change="() => { page = 1 }" />
  <USelectMenu
    v-model="sortBy"
    class="hidden lg:block"
    icon="i-heroicons-bars-arrow-down"
    value-attribute="value"
    :options="sortOptions" />
</template>