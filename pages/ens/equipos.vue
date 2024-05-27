<script setup lang="ts">
import { actions, title } from './equipos/components/config';
// import { filter_options, teams_sort_options, type type_ens_teams } from '@/types/server/ens_types';
import { teams_sort_options, type type_ens_teams } from '@/types/server/ens_types';
import indexList from './equipos/components/indexList.vue';
// import { row } from '@unovis/ts/components/timeline/style';

useHead({ title });
const { state } = useEnsEquipos();
// const { sessionData } = useUserSession();
const router = useRouter();
const totalRows = computed(() => data.value?.[0]?.row_count ?? 0 );
const { data, pending } = await useLazyFetch<type_ens_teams[]>('/api/ens/equipos', { method: 'post', body: state.value.filterPayload });
// const isRightPanelOpen = ref(true);
const { start, finish } = useLoadingIndicator();
watch( () => pending.value, () => { pending.value ? start() : finish(); });
// watch( () => state.value.selectedTeam, () => { isRightPanelOpen.value = true; });

const setNewRoute = async (team: type_ens_teams) => {
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
            :dropdown-actions="actions"
            :sort-options="teams_sort_options" />
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
          :pending="pending"
          :total-rows="totalRows" />
      </UDashboardPanelContent>
    </UDashboardPanel>
    <div class="overflow-scroll w-full">
      <NuxtPage />
    </div>
  </UDashboardPage>  
</template>