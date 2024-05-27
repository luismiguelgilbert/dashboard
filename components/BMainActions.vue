<script setup lang="ts">
import type { DropdownItemExtended } from '~/types/client/DropdownItemExtended';
import type { FilterOption } from '~/types/client/index'; 

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
  }
});

const page = defineModel<number>('page', { default: 1 });
const searchString = defineModel<string>('searchString', { default: '' });
const showFilterPanel = defineModel<boolean>('showFilterPanel', { default: false });
const sortDirection = defineModel<boolean>('sortDirection', { default: true });
const sortOption = defineModel<number>('sortOption', { default: 1 });

const extendedDropdownActions = computed(() => [...props.dropdownActions, [{
  label: 'Filtros y ordenamiento',
  icon: 'i-heroicons-funnel',
  isMainAction: false,
  click: () => { showFilterPanel.value = true; }
}]]);
const inputUI = { icon: { leading: { wrapper: 'content-start items-start pt-2.5' }, base: 'text-gray-400' } };

const updatePropSearchString = useDebounceFn((inputEvent: InputEvent) => {
  page.value = 1;
  searchString.value = (inputEvent.target as HTMLInputElement).value ?? '';
}, 1000);
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
        :items="extendedDropdownActions"
        :popper="{ placement: 'bottom-start' }">
        <UButton
          color="gray"
          trailing-icon="i-heroicons-chevron-down-20-solid" />
      </UDropdown>
    </UButtonGroup>

    <USlideover
      v-model="showFilterPanel"
      prevent-close>
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
  
          <span>
            <div class="grid grid-cols-1 gap-1 sm:gap-5 px-1 sm:px-2 content-start">
              <p class="text-gray-900 dark:text-white font-light">
                Filtrar:
              </p>
            </div>
            <div class="grid grid-cols-1 mt-2 gap-5 px-4 content-start">
              <UCheckbox
                label="Activos"
                :ui="{
                  base: 'h-6 w-6',
                  container: 'flex items-center h-6',
                  label: 'text-md',
                }"
                :model-value="false" />
              <UCheckbox
                label="Inactivos"
                :ui="{
                  base: 'h-6 w-6',
                  container: 'flex items-center h-6',
                  label: 'text-md',
                }"
                :model-value="false" />
            </div>
          </span>
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