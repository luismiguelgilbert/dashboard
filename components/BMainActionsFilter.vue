<script setup lang="ts">
import { type type_filter_option, type type_filter_selection } from '@/types/client/filter_payload';
import BMainActionsFilterModal from './BMainActionsFilterModal.vue';

const props = defineProps({
  filterOptions: {
    type: Array as PropType<type_filter_option[]>,
    required: false,
    default: () => []
  },
});
const page = defineModel<number>('page', { default: 1 });
const filterSelection = defineModel<type_filter_selection>('filterSelection', { default: {} });

const tempKey = ref<number>(1);
const showFieldPanel = ref<boolean>(false);
const currentFieldPanel = ref<type_filter_option>();

const clearFilters = () => {
  page.value = 1;
  filterSelection.value = {};
};

const openFieldPanel = (filter: type_filter_option) => {
  currentFieldPanel.value = filter;
  showFieldPanel.value = true;
};
</script>

<template>
  <div v-if="props.filterOptions.length > 0">
    <span :key="tempKey">
      <div class="grid grid-cols-1 gap-1 sm:gap-5 px-1 sm:px-2 content-start">
        <div class="flex w-full justify-between sm:justify-between">
          <p class="text-gray-900 dark:text-white font-light">
            Filtros:
          </p>
          <UButton
            icon="i-heroicons-backspace"
            class="mr-2"
            size="sm"
            color="gray"
            variant="ghost"
            label="Limpiar filtros"
            @click="clearFilters" />
        </div>
        <div class="space-y-5 px-3 pt-3 sm:pt-0">
          <UButton
            v-for="filter in props.filterOptions"
            :key="filter.key"
            :label="filter.label"
            :color="(filterSelection.hasOwnProperty(filter.key) && filterSelection[filter.key].length > 0 ) ? 'black' : 'gray'"
            :icon="(filterSelection.hasOwnProperty(filter.key) && filterSelection[filter.key].length > 0 ) ? 'i-heroicons-funnel-solid' : 'i-heroicons-chevron-right'"
            :ui="{ block: 'w-full flex justify-between items-center' }"
            block
            trailing
            size="xl"
            @click="openFieldPanel(filter)" />
          <BMainActionsFilterModal
            v-model:showFieldPanel="showFieldPanel"
            v-model:currentFieldPanel="currentFieldPanel"
            v-model:filterSelection="filterSelection"
            v-model:page="page" />
        </div>
        <br />
      </div>
    </span>
  </div>
</template>