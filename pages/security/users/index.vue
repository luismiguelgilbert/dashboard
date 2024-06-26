<script setup lang="ts">
import { actions, module, title } from './components/config';
import { filter_options, sort_options, type type_sys_users } from '@/types/server/sys_users';
import indexTable from './components/indexTable.vue';
import indexList from './components/indexList.vue';

useHead({ title });
const { state } = useSecurityUsers();
const { sessionData } = useUserSession();
const totalRows = computed(() => data.value?.[0]?.row_count ?? 0 );
const { data, pending } = await useLazyFetch<type_sys_users[]>('/api/users', { method: 'post', body: state.value.filterPayload });
const { start, finish } = useLoadingIndicator();
watch( () => pending.value, () => { pending.value ? start() : finish(); });
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        :title="title"
        :badge="totalRows">
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
            :actions="validatePermissions(actions, sessionData.userMenuData)"
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
      <UDashboardPanelContent class="p-0">
        <indexList
          v-if="data"
          :rows="data" />
        <indexTable
          v-if="data"
          :rows="data" />
        <IndexPagination
          v-model:pageSize="state.filterPayload.pageSize"
          v-model:page="state.filterPayload.page"
          :pending="pending"
          :total-rows="totalRows" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>