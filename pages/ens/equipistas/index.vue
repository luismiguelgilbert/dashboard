<script setup lang="ts">
import { actions, module, title } from './components/config';
import { filter_options, type type_ens_members } from '@/types/server/ens_types';
import indexTable from './components/indexTable.vue';
import indexList from './components/indexList.vue';

useHead({ title });
const { state } = useEnsEquipistas();
const { sessionData } = useUserSession();
const rows = ref<Array<type_ens_members>>([]);
const { data, error, pending } = await useLazyFetch<type_ens_members[]>('/api/ens/equipistas', { method: 'post', body: state.value.filterPayload });
if (!error.value && data.value) { rows.value = data.value; }

const totalRows = computed(() => data.value?.[0]?.row_count ?? 0 );
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
              :filter-options="filter_options" />
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
          :filter-options="filter_options" />
      </UDashboardToolbar>
      <UProgress
        class="block sm:hidden"
        size="2xs"
        :value="!pending ? 0: undefined"
        :animation="pending ? 'carousel': undefined" />
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