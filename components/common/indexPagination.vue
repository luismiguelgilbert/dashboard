<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

defineProps({
  pending: {
    type: Boolean,
    required: false,
    default: false
  },
  hasFilter: {
    type: Boolean,
    required: false,
    default: false
  },
  totalRows: {
    type: Number,
    required: false,
    default: 0
  },
});
const emits = defineEmits(['refresh-clicked']);

const isMobile = useBreakpoints(breakpointsTailwind).smaller('sm');
const pageSize = defineModel<number>('pageSize', { default: 0 });
const page = defineModel<number>('page', { default: 1 });
const showFilterPanel = defineModel<boolean>('showFilterPanel', { default: false });
</script>

<template>
  <div class="flex justify-between w-full sm:justify-between px-3 py-1 sm:py-3.5 sm:border-t border-gray-200 dark:border-gray-700">
    <div class="flex flex-row">
      <UButton
        size="sm"
        variant="link"
        :icon="hasFilter ? 'i-heroicons-funnel-solid' : 'i-heroicons-funnel'"
        :color="hasFilter ? 'primary' : 'gray'"
        @click="showFilterPanel = true" />
      <UButton
        size="sm"
        variant="link"
        icon="i-heroicons-arrow-path"
        color="gray"
        :loading="pending"
        @click="emits('refresh-clicked')" />
    </div>
    <UPagination
      v-model="page"
      :size="isMobile ? 'xs' : 'md'"
      :max="4"
      :page-count="pageSize"
      :total="totalRows" />
  </div>
</template>