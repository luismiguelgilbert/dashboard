<script setup lang="ts">
import { pageSizeOptions } from './config';

defineProps({
  pending: {
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

const pageSize = defineModel<number>('pageSize', { default: 0 });
const page = defineModel<number>('page', { default: 1 });
</script>

<template>
  <div class="flex justify-center sm:justify-between px-3 py-3.5 sm:border-t border-gray-200 dark:border-gray-700">
    <USelectMenu
      v-model="pageSize"
      class="hidden lg:block"
      icon="i-heroicons-circle-stack"
      value-attribute="value"
      :options="pageSizeOptions"
      @change="() => { page = 1 }" />
    <UPagination
      v-model="page"
      :page-count="pageSize"
      :total="totalRows"
    />
  </div>
</template>