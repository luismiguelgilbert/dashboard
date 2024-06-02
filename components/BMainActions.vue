<script setup lang="ts">
import type { DropdownItemExtended } from '~/types/client/DropdownItemExtended';
import type { FilterOption } from '~/types/client/index'; 
import type { type_filter_search, type_filter_search_option, type_filter_selections } from '~/types/server/filter_search'; 

const props = defineProps({
  dropdownActions: {
    type: Array as PropType<DropdownItemExtended[][]>,
    required: false,
    default: () => []
  },
  sortOptions: {
    type: Array as PropType<FilterOption[]>,
    required: false,
    default: () => []
  },
  filterOptions: {
    type: Array as PropType<type_filter_search[]>,
    required: false,
    default: () => []
  }
});

//DEFINEMODELS
const page = defineModel<number>('page', { default: 1 });
const searchString = defineModel<string>('searchString', { default: '' });
const showFilterPanel = defineModel<boolean>('showFilterPanel', { default: false });
const sortDirection = defineModel<boolean>('sortDirection', { default: true });
const sortOption = defineModel<number>('sortOption', { default: 1 });
const filterOption = defineModel<Array<type_filter_search_option>>('filterOption', { default: [] });
//REFS AND PROPS
const listOfOptions = ref<Array<type_filter_search_option>>([]);
const isLoading = ref<boolean>(false);
const fieldLoading = ref<type_filter_search>();
const tempKey = ref<number>(1);

const extendedDropdownActions = computed(() => [...props.dropdownActions, [{
  label: 'Filtros y ordenamiento',
  icon: 'i-heroicons-funnel',
  isMainAction: false,
  click: () => { showFilterPanel.value = true; }
}]]);
const inputUI = { icon: { leading: { wrapper: 'content-start items-start pt-2.5' }, base: 'text-gray-400' } };

//ACTIONS
const updatePropSearchString = useDebounceFn((inputEvent: InputEvent) => {
  page.value = 1;
  searchString.value = (inputEvent.target as HTMLInputElement).value ?? '';
}, 1000);

async function addOptions (filter: type_filter_search) {
  const index = listOfOptions.value.findIndex(option => option.key === filter.key);
  if (index === -1) {
    isLoading.value = true;
    fieldLoading.value = filter;
    useFetch('/api/lookups/filter_search', {
      method: 'post',
      body: filter,
      onResponse({ response }) {
        if (response._data) {
          listOfOptions.value.push({
            key: filter.key,
            options: response._data,
          });
        }
        isLoading.value = false;
      },
    });
  }
}

const selectedOption = (filter: type_filter_search) => {
  return filterOption.value.find(option => option.key === filter.key)?.options;
};

const updateOption = (newVal: type_filter_selections, filter: type_filter_search) => {
  const optionIndex = filterOption.value.findIndex(option => option.key === filter.key);
  filterOption.value[optionIndex].options = newVal;
  page.value = 1;
  tempKey.value++;
};

const clearFilters = () => {
  page.value = 1;
  filterOption.value.forEach(filter => {
    filter.options = [];
  });
};

props.filterOptions.forEach(filter => {
  const filterOptionIndex = filterOption.value.findIndex(option => option.key === filter.key);
  if (filterOptionIndex === -1) {
    filterOption.value.push({ key: filter.key, options: [] });
  }
});
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
        :ui="{
          body: { base: 'flex-1 overflow-scroll' },
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800'
        }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Filtros y ordenamiento
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
          <!-- Sort Section-->
          <div v-if="props.sortOptions.length > 0">
            <span>
              <div class="grid grid-cols-1 gap-1 sm:gap-5 px-1 sm:px-2 content-start">
                <p class="text-gray-900 dark:text-white font-light">
                  Orden:
                </p>
                <div>
                  <UButtonGroup
                    class="flex items-center justify-center"
                    orientation="horizontal">
                    <UButton
                      size="xs"
                      class="grow justify-center"
                      label="Ascendente"
                      icon="i-heroicons-arrow-up-circle"
                      :color="sortDirection ? 'primary' : 'white'"
                      @click="sortDirection = true" />
                    <UButton
                      size="xs"
                      class="grow justify-center"
                      label="Descendente"
                      icon="i-heroicons-arrow-down-circle"
                      :color="!sortDirection ? 'primary' : 'white'"
                      @click="sortDirection = false" />
                  </UButtonGroup>
                </div>
                <div class="space-y-2 px-3 pt-3 sm:pt-0">
                  <URadio
                    v-for="option of sortOptions"
                    :key="option.value"
                    v-model="sortOption"
                    :label="`Columna ${option.label}`"
                    :value="option.value" />
                </div>
              </div>
            </span>
            <UDivider class="col-span-1 my-5" />
          </div>
  
          <!-- Filter Section-->
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
                    color="primary"
                    variant="soft"
                    label="Limpiar filtros"
                    @click="clearFilters" />
                </div>
                <div class="space-y-5 px-3 pt-3 sm:pt-0">
                  <UFormGroup
                    v-for="filter in props.filterOptions"
                    :key="filter.key"
                    :label="`${filter.label}:`"
                    class="px-2">
                    <!-- by="value" -->
                    <USelectMenu
                      :model-value="selectedOption(filter)"
                      class="w-full"
                      multiple
                      searchable
                      placeholder="Seleccionar..."
                      option-attribute="label"
                      value-attribute="value"
                      :loading="isLoading && fieldLoading?.key === filter.key"
                      :options="listOfOptions.find(field => field.key === filter.key)?.options"
                      @open="addOptions(filter)"
                      @change="updateOption($event, filter)">
                      <template #label>
                        <span
                          v-if="selectedOption(filter)?.length"
                          class="font-bold text-primary-500">
                          {{ `${selectedOption(filter)?.length} seleccionados` }}
                        </span>
                        <span v-else>Seleccionar..</span>
                      </template>
                    </USelectMenu>
                  </UFormGroup>
                </div>
                <br />
              </div>
            </span>
          </div>
        </div>
        
        <template #footer>
          <UButton
            block
            icon="i-heroicons-x-circle"
            @click="showFilterPanel = false">
            Cerrar panel
          </UButton>
        </template>
      </UCard>
    </USlideover>
  </div>
</template>