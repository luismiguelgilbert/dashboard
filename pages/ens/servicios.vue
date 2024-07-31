<script setup lang="ts">
import { useActions, title, sort_options, filter_options } from './servicios/components/config';
import { type type_ens_servicios } from '@/types/server/ens/ens_servicios';
import indexList from './servicios/components/indexList.vue';

useHead({ title });
const { sessionData, handleUnauthorized } = useUserSession();
const { state, hasFilter } = useEnsServicios();
const router = useRouter();
const totalRows = computed<number>(() => data.value?.[0]?.row_count ?? 0 );
const isRightPanelOpen = computed<boolean>(() => router.currentRoute.value.name === 'ens-servicios');
const { data, pending, refresh, error } = await useLazyFetch('/api/ens/servicios', { method: 'post', body: state.value.filterPayload });
const { start, finish } = useLoadingIndicator();
watch( () => pending.value, () => { pending.value ? start() : finish(); });
watch([error], ([errorData]) => { errorData?.statusCode === 401 && handleUnauthorized(refresh); });

const setNewRoute = async (team: type_ens_servicios) => {
  state.value.selectedId = team.id!;
  router.push(`/ens/servicios/servicio-${team.id}`);
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
            :sort-options="sort_options"
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
          :pending="pending"
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