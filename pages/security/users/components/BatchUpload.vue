<script setup lang="ts">
import { batchResultColumns } from './config';
const { state } = useSecurityUsersBatch();

const totalRows = computed(() => state.value.resultsValid.length);
const computeRows = computed(() => {
  return state.value.resultsValid.slice((state.value.resultsValidPage - 1) * state.value.pageCount, (state.value.resultsValidPage) * state.value.pageCount);
});

// const createUsers = async () => {
//   state.value.isLoading = true;
//   await useFetch('/api/users/bulk-create', {
//     method: 'POST',
//     body: {
//       mapping: state.value.mapping,
//       users: state.value.errors.filter(x => x.errors.length <= 0).slice(0, 2),
//     },
//   });
//   state.value.isLoading = false;
// };
</script>

<template>
  <UDashboardPanelContent class="p-0">
    <UTable
      :rows="computeRows"
      :columns="batchResultColumns.filter(x => x.key !== 'errors')"
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
          v-model="state.resultsValidPage"
          :page-count="state.pageCount"
          :total="totalRows"
          class="place-content-end p-2" />
      </div>
    </div>
  </UDashboardPanelContent>
</template>