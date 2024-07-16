<script setup lang="ts">
const { state } = useSecurityUsersBatch();

const totalRows = computed(() => state.value.rows.length);
const computeRows = computed(() => {
  return state.value.rows.slice((state.value.page - 1) * state.value.pageCount, (state.value.page) * state.value.pageCount);
});
</script>

<template>
  <UDashboardPanelContent class="p-0">
    <UTable
      :rows="computeRows"
      :columns="state.columns"
      :ui="{ 
        th: { base: 'sticky top-0 z-10 bg-white dark:bg-gray-900' },
        divide: 'divide-gray-200 dark:divide-gray-800',
      }"
      sort-mode="manual"
      class="w-full h-[calc(100dvh-165px)]" />
    <UDivider />
    <div class="flex ...">
      <div class="flex-none w-36 content-center pl-5">
        <span
          v-if="state.rows.length"
          class="hidden sm:block">
          Registros: {{ state.rows.length }}
        </span>
      </div>
      <div class="grow" />
      <div class="flex-none w-14">
        <UPagination
          v-model="state.page"
          :page-count="state.pageCount"
          :total="totalRows"
          class="place-content-end p-2" />
      </div>
    </div>
  </UDashboardPanelContent>
</template>