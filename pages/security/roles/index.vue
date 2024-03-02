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

const updatePropSearchString = useDebounceFn((inputEvent: InputEvent) => {
  state.filterPayload.page = 1
  state.filterPayload.searchString = (inputEvent.target as HTMLInputElement).value ?? ''
}, 1000)
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
          <!-- <USelectMenu
            v-if="filter_options?.length > 1"
            v-model="state.filterPayload.filterBy"
            class="hidden lg:block"
            icon="i-heroicons-funnel"
            placeholder="Todos"
            value-attribute="value"
            multiple
            :options="filter_options"
            :ui-menu="{ option: { base: 'capitalize' } }"
            @change="() => { state.filterPayload.page = 1 }"
          />
          <USelectMenu
            v-model="state.filterPayload.sortBy"
            class="hidden lg:block"
            icon="i-heroicons-bars-arrow-down"
            placeholder="Location"
            value-attribute="value"
            :options="sort_options"
          />
          <UButtonGroup size="sm" orientation="horizontal">
            <UButton :label="`Crear ${module}`" color="gray" icon="i-heroicons-plus" />
            <UButton icon="i-heroicons-chevron-down-20-solid" color="gray" />
          </UButtonGroup> -->
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