<script setup lang="ts">
import { useActions, title, filter_options } from './users/components/config';
import { type type_sys_users, sys_users } from '@/types/server/security/sys_users';
import indexList from './users/components/indexList.vue';
import { array } from 'yup';

useHead({ title });
const { sessionData } = useUserSession();
const { state, hasFilter, selectedFiltersFacet } = useSecurityUsers();
const router = useRouter();
const totalRows = ref<number>(0);
const data = ref<type_sys_users[]>([]);
const isRightPanelOpen = computed<boolean>(() => router.currentRoute.value.name === 'security-users');

const refresh = async() => {
  try {
    state.value.isLoading = true;
    const { data: algoliaData } = await useAsyncAlgoliaSearch({ 
      indexName: 'sys_users',
      query: state.value.filterPayload.searchString,
      requestOptions: {
        page: (state.value.filterPayload.page - 1),
        cacheable: false,
        facetFilters: selectedFiltersFacet.value ? selectedFiltersFacet.value : undefined,
      }
    });
    state.value.filterPayload.pageSize = algoliaData.value.hitsPerPage;
    totalRows.value = algoliaData.value.nbHits;
    data.value =  array(sys_users).cast(algoliaData.value.hits) ?? [];
  } catch(error) {
    console.error(error);
  } finally {
    state.value.isLoading = false;
  }
};
watch(() => state.value.filterPayload, () => refresh(), { deep: true });
refresh();

const setNewRoute = async (record: type_sys_users) => {
  state.value.selectedId = record.id!;
  router.push(`/security/users/user-${record.id}`);
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel class="w-full lg:w-[calc(35dvw)] min-w-full lg:min-w-[calc(35dvw)]">
      <UDashboardNavbar
        :title="title"
        :badge="totalRows">
        <template #right>
          <BMainActions
            v-model:page="state.filterPayload.page"
            v-model:searchString="state.filterPayload.searchString"
            v-model:showFilterPanel="state.showFilterPanel"
            v-model:sortOption="state.filterPayload.sortBy"
            v-model:sortDirection="state.filterPayload.sortByOrder"
            v-model:filterSelection="state.filterPayload.filterSelection"
            :dropdown-actions="useActions(state.filterPayload, sessionData.userMenuData!)"
            :sort-options="[]"
            :filter-options="filter_options" />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="p-0">
        <indexList
          v-if="data"
          :rows="data"
          @row-click="(row) => setNewRoute(row)" />
        <IndexPagination
          v-model:pageSize="state.filterPayload.pageSize"
          v-model:page="state.filterPayload.page"
          v-model:showFilterPanel="state.showFilterPanel"
          :has-filter="hasFilter"
          :pending="state.isLoading"
          :total-rows="totalRows"
          @refresh-clicked="refresh" />
      </UDashboardPanelContent>
    </UDashboardPanel>
    <div class="overflow-y-auto w-full">
      <NuxtPage />
      <BFormNoSelection v-if="isRightPanelOpen" />
    </div>
  </UDashboardPage>  
</template>