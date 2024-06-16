<script setup lang="ts">
import { type type_sort_option_client } from '@/types/client/filter_payload';

const props = defineProps({
  sortOptions: {
    type: Array as PropType<type_sort_option_client[]>,
    required: false,
    default: () => []
  },
});
const sortDirection = defineModel<boolean>('sortDirection');
const sortOption = defineModel<string>('sortOption');
</script>

<template>
  <div v-if="props.sortOptions.length > 0">
    <span>
      <div class="grid grid-cols-1 gap-1 sm:gap-5 px-1 sm:px-2 content-start">
        <p class="text-gray-900 dark:text-white font-light">
          Orden:
        </p>
        <div>
          <UPricingToggle
            v-model="sortDirection"
            left="Descendente"
            right="Ascendente" />
        </div>
        <div class="space-y-2 pt-3 sm:pt-0">
          <UFormGroup
            label="Ordenar por:"
            class="px-2">
            <USelectMenu
              v-model="sortOption"
              class="w-full"
              size="xl"
              option-attribute="label"
              value-attribute="key"
              :options="sortOptions" />
          </UFormGroup>
        </div>
      </div>
    </span>
    <UDivider class="col-span-1 my-5" />
  </div>
</template>