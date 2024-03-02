<script setup lang="ts">
import { module, title } from './config'
import { filter_options, sort_options, type type_sys_users } from '@/types/server/sys_users'
import indexTable from './indexTable.vue'
import indexList from './indexList.vue'

useHead({ title })

const state = reactive({
  rows: [] as type_sys_users[],
  rowsCount: 0,
  selectedRows: [],
  filterPayload: {
    pageSize: 50,
    filterBy: [],
    sortBy: 1,
    page: 1,
    searchString: ''
  }
})
const totalRows = computed(() => data.value?.[0]?.row_count ?? 0 )

const { data, error, pending } = await useFetch<type_sys_users[]>('/api/users', { method: 'post', body: state.filterPayload })
if (!error.value && data.value) { state.rows = data.value }

const goToCreateForm = async () => {
  await navigateTo('/security/users/create');
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="title" :badge="totalRows">
        <template #right>
          <IndexSearchDesktop
            v-model:searchString="state.filterPayload.searchString"
            v-model:page="state.filterPayload.page"
            v-model:filterBy="state.filterPayload.filterBy"
            v-model:sortBy="state.filterPayload.sortBy"
            :placeholder="`Buscar ${module}...`"
            :filterOptions="filter_options"
            :sortOptions="sort_options" />
          <IndexCreateButton
            :label="`Nuevo ${module}`"
            @click="goToCreateForm" />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="p-0">
        <indexList v-if="data" :rows="data" />
        <indexTable v-if="data" :rows="data" />
        <IndexPagination
          v-model:pageSize="state.filterPayload.pageSize"
          v-model:page="state.filterPayload.page"
          :pending="pending"
          :totalRows="totalRows" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>