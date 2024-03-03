<script setup lang="ts">
import { module, title } from './config'
import { filter_options, sort_options, type type_sys_users } from '@/types/server/sys_users'
import indexTable from './indexTable.vue'
import indexList from './indexList.vue'

useHead({ title })

const { filterPayload } = useSecurityUsers();
const rows = ref<type_sys_users[]>([]);
const totalRows = computed(() => data.value?.[0]?.row_count ?? 0 );

const { data, error, pending } = await useFetch<type_sys_users[]>('/api/users', { method: 'post', body: filterPayload.value })
if (!error.value && data.value) { rows.value = data.value }

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
            v-model:searchString="filterPayload.searchString"
            v-model:page="filterPayload.page"
            v-model:filterBy="filterPayload.filterBy"
            v-model:sortBy="filterPayload.sortBy"
            :placeholder="`Buscar ${module}...`"
            :filter-options="filter_options"
            :sort-options="sort_options" />
          <IndexCreateButton
            :label="`Nuevo ${module}`"
            @click="goToCreateForm" />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="p-0">
        <indexList v-if="data" :rows="data" />
        <indexTable v-if="data" :rows="data" />
        <IndexPagination
          v-model:pageSize="filterPayload.pageSize"
          v-model:page="filterPayload.page"
          :pending="pending"
          :total-rows="totalRows" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>