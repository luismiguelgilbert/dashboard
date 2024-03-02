<script setup lang="ts">
import { module, title } from './config'
import { filter_options, sort_options, type type_sys_profiles } from '@/types/server/sys_profiles'
import indexTable from './indexTable.vue'
import indexList from './indexList.vue'

useHead({ title })
defineShortcuts({
  '/': () => { input.value?.input?.focus() }
})

const state = reactive({
  rows: [] as type_sys_profiles[],
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
const input = ref<{ input: HTMLInputElement }>()
const totalRows = computed(() => data.value?.[0]?.row_count ?? 0 )

const { data, error, pending } = await useFetch<type_sys_profiles[]>('/api/roles', { method: 'post', body: state.filterPayload })
if (!error.value && data.value) { state.rows = data.value ?? [] }
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
          <IndexCreateButton :label="`Nuevo ${module}`" />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="p-0">
        <indexList v-if="data" :rows="data" />
        <indexTable v-if="data" :rows="data" />
        <IndexPagination :pending="pending" :totalRows="totalRows" v-model:pageSize="state.filterPayload.pageSize" v-model:page="state.filterPayload.page" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>