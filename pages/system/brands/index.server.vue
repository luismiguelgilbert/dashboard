<script setup lang="ts">
import { filter_options, sort_options, type type_sys_users } from '@/types/server/sys_users'

const router = useRouter();
const { query } = router.currentRoute.value;
// console.log("query", query);
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

// const url = useRequestURL();
// console.log(url.origin)
// console.log(url.searchParams)
// for (const p of url.searchParams) {
//   console.log(p);
// }

// console.log('before');
// console.log(router.currentRoute.value.query);
// console.log(router.currentRoute.value.query)

const { data, error, pending } = await useFetch('/api/users', { method: 'post', body: state.filterPayload })
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
          <!-- <UPagination :model-value="1" :page-count="state.filterPayload.pageSize" :total="totalRows" /> -->
          <UDivider />
          <div class="p-4">
            <!-- :ui="{ rounded: '' }" -->
            <UButton
              v-for="(page, index) of (totalRows / state.filterPayload.pageSize)"
              :label="`${page}`"
              :to="`?page=${page}`"
              color="black"
              variant="outline" />
          </div>
          <!-- <div>
            <UButton type="submit" to="?page=1"> prev </UButton>
            <UButton type="submit" to="?page=2&search=test"> next </UButton>
          </div> -->
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>