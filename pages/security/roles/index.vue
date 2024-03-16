<script setup lang="ts">
import { actions, mainAction, module, title } from './config'
import { filter_options, sort_options, type type_sys_profiles } from '@/types/server/sys_profiles'
import indexTable from './indexTable.vue'
import indexList from './indexList.vue'

useHead({ title })

const { state } = useSecurityRoles();
const rows = ref<type_sys_profiles[]>([]);
const totalRows = computed(() => data.value?.[0]?.row_count ?? 0 );

const { data, error, pending } = await useFetch<type_sys_profiles[]>('/api/roles', { method: 'post', body: state.value.filterPayload })
if (!error.value && data.value) { rows.value = data.value }
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="title" :badge="totalRows">
        <template #right>
          <div class="hidden sm:flex items-stretch flex-shrink-0 gap-1.5">
            <IndexSearchDesktop
              v-model:searchString="state.filterPayload.searchString"
              v-model:page="state.filterPayload.page"
              v-model:filterBy="state.filterPayload.filterBy"
              v-model:sortBy="state.filterPayload.sortBy"
              class="hidden sm:flex items-stretch flex-shrink-0 gap-1.5"
              :placeholder="`Buscar ${module}...`"
              :filter-options="filter_options"
              :sort-options="sort_options" />
          </div>
          <IndexCreateButton
            :main-action="mainAction"
            :actions="actions"
            :is-loading="state.isLoading" />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar class="flex sm:hidden">
        <IndexSearchMobile
          v-model:searchString="state.filterPayload.searchString"
          v-model:page="state.filterPayload.page"
          v-model:filterBy="state.filterPayload.filterBy"
          v-model:sortBy="state.filterPayload.sortBy"
          class="hidden sm:flex items-stretch flex-shrink-0 gap-1.5"
          :placeholder="`Buscar ${module}...`"
          :filter-options="filter_options"
          :sort-options="sort_options" />
      </UDashboardToolbar>
      <UProgress class="block sm:hidden" size="2xs" :value="!pending ? 0: undefined" :animation="pending ? 'carousel': undefined" />
      <UDashboardPanelContent class="p-0">
        <indexList v-if="data" :rows="data" />
        <indexTable v-if="data" :rows="data" />
        <IndexPagination
          v-model:pageSize="state.filterPayload.pageSize"
          v-model:page="state.filterPayload.page"
          :pending="pending"
          :total-rows="totalRows" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>