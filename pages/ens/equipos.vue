<script setup lang="ts">
import { actions, title } from './equipos/components/config';
import { sort_options, filter_options, type type_ens_teams } from '@/types/client/ens/ens_teams';
import indexList from './equipos/components/indexList.vue';

useHead({ title });
const { state, hasFilter } = useEnsEquipos();
const router = useRouter();
const totalRows = computed<number>(() => data.value?.[0]?.row_count ?? 0 );
const isRightPanelOpen = computed<boolean>(() => router.currentRoute.value.name === 'ens-equipos');
const { data, pending } = await useLazyFetch<type_ens_teams[]>('/api/ens/equipos', { method: 'post', body: state.value.filterPayload });
const { start, finish } = useLoadingIndicator();
watch( () => pending.value, () => { pending.value ? start() : finish(); });

const setNewRoute = async (team: type_ens_teams) => {
  if (state.value.selectedId === team.id) {
    state.value.selectedId = null;
    router.push('/ens/equipos');
    return;
  }
  if (team.id) {
    state.value.selectedId = team.id;
    router.push(`/ens/equipos/equipo-${team.id}`);
  }
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel>
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
            :dropdown-actions="actions"
            :sort-options="sort_options"
            :filter-options="filter_options" />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="p-0">
        <indexList
          v-if="data"
          :rows="data"
          @row-click="(team: type_ens_teams) => setNewRoute(team)" />
        <IndexPagination
          v-model:pageSize="state.filterPayload.pageSize"
          v-model:page="state.filterPayload.page"
          v-model:showFilterPanel="state.showFilterPanel"
          :has-filter="hasFilter"
          :pending="pending"
          :total-rows="totalRows" />
      </UDashboardPanelContent>
    </UDashboardPanel>
    <div class="overflow-scroll w-full">
      <NuxtPage />
      <BFormNoSelection v-if="isRightPanelOpen" />
    </div>
  </UDashboardPage>  
</template>