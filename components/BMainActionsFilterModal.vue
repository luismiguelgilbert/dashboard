<script setup lang="ts">
import { type type_filter_option, type type_filter_object, type type_filter_selection } from '@/types/client/filter_payload';
import type { type_filter_search_option } from '~/types/server/filter_search'; 

const showFieldPanel = defineModel<boolean>('showFieldPanel');
const currentFieldPanel = defineModel<type_filter_option>('currentFieldPanel');
const filterSelection = defineModel<type_filter_selection>('filterSelection');

const listOfOptions = ref<Array<type_filter_search_option>>([]);
const isLoading = ref<boolean>(false);
const searchString = ref('');
const _filterSelection = ref<type_filter_selection>();

//COMPUTED
const listOfOptionsForCurrentField = computed(() => {
  return listOfOptions.value.find(filter => filter.key === currentFieldPanel.value?.key)?.options;
});
const filteredRows = computed(() => {
  if (!searchString.value) {
    return listOfOptionsForCurrentField.value;
  }

  return listOfOptionsForCurrentField.value?.filter((record) => {
    return Object.values(record).some((value) => {
      return String(value).toLowerCase().includes(searchString.value.toLowerCase());
    });
  });
});

//ACTIONS
const fetchOptions = async () => {
  _filterSelection.value = JSON.parse(JSON.stringify(filterSelection.value));
  const index = listOfOptions.value.findIndex(option => option.key === currentFieldPanel.value?.key);
  if (index === -1) {
    isLoading.value = true;
    useFetch(currentFieldPanel.value?.endpointURL!, {
      method: 'post',
      body: currentFieldPanel.value,
      onResponse({ response }) {
        if (response._data) {

          listOfOptions.value.push({
            key: currentFieldPanel.value?.key!,
            options: response._data as type_filter_object[],
          });
        }
        isLoading.value = false;
      },
    });
  }
};
const selectionChanged = (value: boolean, row: type_filter_object) => {
  const propertyName: string = currentFieldPanel.value?.key!;
  if (_filterSelection.value && value) {
    // eslint-disable-next-line
    const filterExists = _filterSelection.value.hasOwnProperty(propertyName);
    if (!filterExists) {
      Object.assign(_filterSelection.value, {[propertyName]: [row.value]});
    } else {
      const rowExists = _filterSelection.value[propertyName].some((option) => option === row.value);
      if (!rowExists) {
        _filterSelection.value[propertyName].push(row.value);
      }
    }
  } else if (_filterSelection.value) {
    _filterSelection.value[propertyName] = _filterSelection.value[propertyName].filter((option) => option !== row.value);
  }
};
const applyFilter = () => {
  filterSelection.value = _filterSelection.value;
  showFieldPanel.value = false;
};
const clearFilter = () => {
  const propertyName: string = currentFieldPanel.value?.key!;
  if (_filterSelection.value) {
    _filterSelection.value[propertyName] = [];
  }
  applyFilter();
};

watch(showFieldPanel, () => { searchString.value= ''; if (showFieldPanel.value) { fetchOptions(); } });
</script>

<template>
  <USlideover v-model="showFieldPanel">
    <UCard
      v-if="currentFieldPanel"
      class="flex flex-col flex-1"
      :ui="{
        body: {
          base: 'flex-1 overflow-scroll',
          padding: 'sm:p-0 p-0',
        },
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800'
      }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ `Filtrar ${currentFieldPanel.label}` }}
            <UBadge variant="soft">
              {{ listOfOptionsForCurrentField?.length ?? 0 }}
            </UBadge>
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="showFieldPanel = false" />
        </div>
        <UInput
          v-model="searchString"
          class="mt-4"
          placeholder="Buscar..."
          icon="i-heroicons-magnifying-glass-20-solid" />
      </template>
      
      <div class="h-[calc(100dvh-365px)]">
        <UCard
          :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' }, rounded: 'rounded-none', }"
          class="min-w-0">
          <ul
            role="list"
            class="divide-y divide-gray-200 dark:divide-gray-800">
            <li
              v-for="(row, index) in filteredRows"
              :key="index"
              class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6 hover:bg-primary-100 dark:hover:bg-primary-900">
              <div class="flex items-center gap-3 min-w-0">
                <div class="text-sm min-w-0">
                  <div class="flex items-center gap-3">
                    <UCheckbox
                      :model-value="_filterSelection && _filterSelection[currentFieldPanel.key]?.includes(row.value)"
                      @change="selectionChanged($event, row)" />
                    <div class="text-base dark:text-white text-black truncate">
                      {{ row.label }}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </UCard>
      </div>
        
      <template #footer>
        <UButton
          class="mb-4"
          block
          color="gray"
          icon="i-heroicons-backspace"
          label="Limpiar filtros"
          @click="clearFilter" />
        <UButton
          block
          color="gray"
          icon="i-heroicons-funnel"
          label="Aplicar filtros"
          @click="applyFilter" />
      </template>
    </UCard>
  </USlideover>
</template>