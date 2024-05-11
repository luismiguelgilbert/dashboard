<script setup lang="ts">

const router = useRouter();
const { query } = router.currentRoute.value;
const state = {
  isLoading: false,
  filterPayload: {
    pageSize: 25,
    filterBy: [],
    sortBy: 1,
    page: query.page ? parseInt(query.page as string) : 1,
    searchString: ''
  }
};
let totalRows = 0;

const { data } = await useFetch('/api/users', { method: 'post', body: state.filterPayload });
totalRows = data.value?.[0].row_count ?? 0;
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Test">
      </UDashboardNavbar>
      <UDashboardPanelContent class="p-0">
        <div class="h-screen w-screen">
          <UTable
            :rows="data"
            :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
            class="h-[calc(100%-8rem)] w-screen"
            sort-mode="manual"
          />
          <UDivider />
          <div class="p-4">
            <UButton
              v-for="(page, index) of (totalRows / state.filterPayload.pageSize)"
              :key="index"
              :label="`${page}`"
              :to="`?page=${page}`"
              color="black"
              variant="outline" />
          </div>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>