<script setup lang="ts">
import { actions, module, title } from './components/config'
import { filter_options, sort_options, type type_sys_users } from '@/types/server/sys_users'
import indexTable from './components/indexTable.vue'
import indexList from './components/indexList.vue'

useHead({ title })
const { state } = useSecurityUsers();
const { sessionData } = useUserSession();
// const rows = ref<type_sys_users[]>([]);
// const rows = ref([]);
const totalRows = computed(() => data.value?.[0]?.row_count ?? 0 );
// const totalRows = ref(0);
// const from = computed(() => state.value.filterPayload.page * state.value.filterPayload.pageSize - state.value.filterPayload.pageSize + 1);
// const to = computed(() => state.value.filterPayload.page * state.value.filterPayload.pageSize);


// const client = useSupabaseClient();
// // console.log({client})
// const pending = ref(false);
// const { data, refresh } = await useAsyncData('users', async () => {
//   const { data, error, status, count } = await client
//     .from('sys_users')
//     // .select('*', { count: 'exact', head: false })
//     .select('*', { count: 'exact' })
//     // .select()
//     // .select(`*, (count)`)
//     .limit(25)
//     // .range(0, 50);
//     .range(from.value, to.value)
//     .order("user_lastname", { ascending: true })

    
//     // .eq('name', 'My Restaurant Name')
//     // .single()
//     ;
//   console.log({data});
//   // console.log('count', {count});
//   // console.log('error', {error});
//   // console.log('status', {status});
//   totalRows.value = count ?? 0;
//   rows.value = data ?? [];
//   // return data
// })

// watch(
//   () => state.value.filterPayload.page,
//   () => {
//     console.log('refresh data');
//     refresh();
//   }
// )

const { data, error, pending } = await useLazyFetch<type_sys_users[]>('/api/users', { method: 'post', body: state.value.filterPayload })
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
      <UProgress class="block sm:hidden" size="2xs" :value="!pending ? 0: undefined" :animation="pending ? 'carousel': undefined" />
      <UDashboardPanelContent class="p-0">
        <indexList v-if="data" :rows="data" />
        <indexTable v-if="data" :rows="data" :loading="pending" />
        <IndexPagination
          v-model:pageSize="state.filterPayload.pageSize"
          v-model:page="state.filterPayload.page"
          :pending="pending"
          :total-rows="totalRows" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>