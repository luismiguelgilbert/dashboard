<script setup lang="ts">
import type { DropdownItemExtended } from '~/types/client/DropdownItemExtended';
import { 
  type type_filter_option,
  type type_sort_option_client,
  type type_filter_selection,
} from '@/types/client/filter_payload';
import BMainActionsSorting from './BMainActionsSorting.vue';
import BMainActionsFilter from './BMainActionsFilter.vue';

const props = defineProps({
  dropdownActions: {
    type: Array as PropType<DropdownItemExtended[][]>,
    required: false,
    default: () => []
  },
  sortOptions: {
    type: Array as PropType<type_sort_option_client[]>,
    required: false,
    default: () => []
  },
  filterOptions: {
    type: Array as PropType<type_filter_option[]>,
    required: false,
    default: () => []
  }
});

//DEFINEMODELS
const page = defineModel<number>('page', { default: 1 });
const searchString = defineModel<string>('searchString', { default: '' });
const showFilterPanel = defineModel<boolean>('showFilterPanel', { default: false });
const sortDirection = defineModel<boolean>('sortDirection', { default: true });
const sortOption = defineModel<string>('sortOption', { default: '' });
const filterSelection = defineModel<type_filter_selection>('filterSelection', { default: {} });

//REFS AND PROPS
const cardUI = {
  body: { base: 'flex-1 overflow-scroll' },
  ring: '',
  divide: 'divide-y divide-gray-100 dark:divide-gray-800'
};
const inputUI = { icon: { leading: { wrapper: 'content-start items-start pt-2.5' }, base: 'text-gray-400' } };
const extendedDropdownActions = computed(() => [...props.dropdownActions, [{
  label: props.sortOptions.length > 0 ? 'Filtros y Orden' : 'Filtros',
  icon: 'i-heroicons-funnel',
  isMainAction: false,
  click: () => { showFilterPanel.value = true; }
}]]);

//ACTIONS
const updatePropSearchString = (inputEvent: InputEvent) => {
  page.value = 1;
  searchString.value = (inputEvent.target as HTMLInputElement).value ?? '';
};
</script>

<template>
  <div>
    <UButtonGroup
      size="xs"
      orientation="horizontal">
      <UInput
        :model-value="searchString"
        :ui="inputUI"
        autocomplete="off"
        placeholder="Buscar..."
        class="z-10 max-w-24 sm:max-w-full"
        @keydown.esc="$event.target.blur()"
        @input="updatePropSearchString" />
      <UDropdown
        mode="hover"
        :items="extendedDropdownActions"
        :popper="{ placement: 'bottom-start' }">
        <UButton
          color="gray"
          trailing-icon="i-heroicons-chevron-down-20-solid" />
      </UDropdown>
    </UButtonGroup>
    
    <USlideover v-model="showFilterPanel">
      <UCard
        class="flex flex-col flex-1"
        :ui="cardUI">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ props.sortOptions.length > 0 ? 'Filtros y Orden' : 'Filtros' }}
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="showFilterPanel = false" />
          </div>
        </template>

        <div class="h-[calc(100dvh-365px)]">
          <BMainActionsSorting
            v-model:sort-direction="sortDirection"
            v-model:sort-option="sortOption"
            :sort-options="props.sortOptions" />
          <BMainActionsFilter
            v-model:filter-selection="filterSelection"
            v-model:page="page"
            :filter-options="props.filterOptions" />
        </div>
      </UCard>
    </USlideover>
  </div>
</template>