<script setup lang="ts">
import { batchResultColumns } from './config';
const { state } = useSecurityUsersBatch();

const totalRows = computed(() => state.value.resultsError.length);
const computeRows = computed(() => {
  return state.value.resultsError.slice((state.value.resultsErrorPage - 1) * state.value.pageCount, (state.value.resultsErrorPage) * state.value.pageCount);
});
</script>

<template>
  <UDashboardPanelContent class="p-0">
    <UTable
      :rows="computeRows"
      :columns="batchResultColumns"
      :ui="{ 
        th: { base: 'sticky top-0 z-10 bg-white dark:bg-gray-900' },
        divide: 'divide-gray-200 dark:divide-gray-800',
      }"
      sort-mode="manual"
      class="w-full h-[calc(100dvh-165px)]">
      <template #user_sex-data="{ row }">
        <font-awesome-icon
          v-if="row.user_sex"
          icon="fa-solid fa-person"
          class="text-emerald-500" />
        <font-awesome-icon
          v-if="!row.user_sex"
          icon="fa-solid fa-person-dress"
          class="text-rose-300" />
      </template>
      <template #errors-data="{ row }">
        <li
          v-for="(error, index) in row.errors"
          :key="index">
          <span class="text-red-500">{{ error }}</span>
        </li>
      </template>
    </UTable>
    <UDivider />
    <div class="flex ...">
      <div class="flex-none w-36 content-center pl-5">
        <span
          v-if="totalRows"
          class="hidden sm:block">
          Registros: {{ totalRows }}
        </span>
      </div>
      <div class="grow" />
      <div class="flex-none w-14">
        <UPagination
          v-model="state.resultsErrorPage"
          :page-count="state.pageCount"
          :total="totalRows"
          class="place-content-end p-2" />
      </div>
    </div>
  </UDashboardPanelContent>
</template>