<script setup lang="ts">
import { columns, module, pageSizeOptions, title, rowActions } from './config'
import { filter_options, sort_options, type type_sys_users } from '@/types/server/sys_users'

useHead({ title })
defineShortcuts({
  '/': () => { input.value?.input?.focus() }
})

const state = reactive({
  rows: [],
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

const { data, error, pending } = await useFetch<type_sys_users[]>('/api/users', { method: 'post', body: state.filterPayload })
if (!error.value && data.value) { state.rows = data.value as type_sys_users[] }

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
          <UInput
            ref="input"
            :model-value="state.filterPayload.searchString"
            icon="i-heroicons-magnifying-glass"
            autocomplete="off"
            class="hidden sm:block"
            :placeholder="`Buscar ${module}...`"
            @keydown.esc="$event.target.blur()"
            @input="updatePropSearchString"
          >
            <template #trailing>
              <UKbd value="/" />
            </template>
          </UInput>
          <USelectMenu
            v-if="filter_options.length > 1"
            v-model="state.filterPayload.filterBy"
            class="hidden lg:block"
            icon="i-heroicons-funnel"
            placeholder="Todos"
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
          </UButtonGroup>
        </template>
      </UDashboardNavbar>
      <!-- <UDashboardToolbar class="block lg:hidden">
        <USelectMenu
          v-model="state.filterPayload.filterBy"
          icon="i-heroicons-funnel"
          placeholder="Status"
          multiple
          :options="filter_options"
          :ui-menu="{ option: { base: 'capitalize' } }"
        />
        <UInput
          ref="input"
          v-model="state.filterPayload.searchString"
          icon="i-heroicons-magnifying-glass"
          autocomplete="off"
          :placeholder="`Buscar ${module}...`"
          @keydown.esc="$event.target.blur()"
        >
          <template #trailing>
            <UKbd value="/" />
          </template>
        </UInput>
      </UDashboardToolbar> -->
      <UTable
        v-model="state.selectedRows"
        :rows="data"
        :columns="columns"
        sort-mode="manual"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      >
        <template #column-a-data="{ row }: { row: type_sys_users }">
          <div class="flex items-center gap-3">
            <UAvatar
              v-if="row.avatar_url && row.avatar_url.length > 0"
              :src="row.avatar_url"
              :avatar="{ src: row.avatar_url }"
              size="xs"
            />
            <UAvatar
              v-else
              size="xs"
            >
              {{ row.user_name[0] }}
            </UAvatar>
            <div class="text-base font-semibold dark:text-white text-black">
              {{ `${row.user_name} ${row.user_lastname}` }}
            </div>
          </div>
        </template>
        <template #column-b-data="{ row }: { row: type_sys_users }">
          {{ row.email }}
        </template>
        <template #column-c-data="{ row }: { row: type_sys_users }">
          {{ row.sys_profile_name }}
        </template>
        <template #actions-data="{ row }">
          <UDropdown :items="rowActions(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
      <UProgress v-if="pending" animation="carousel" size="xs" />
      <div class="flex justify-between px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        <USelectMenu
          v-model="state.filterPayload.pageSize"
          class="hidden lg:block"
          icon="i-heroicons-circle-stack"
          value-attribute="value"
          :options="pageSizeOptions"
          @change="() => { state.filterPayload.page = 1 }"
        />
        <UPagination v-model="state.filterPayload.page" :page-count="state.filterPayload.pageSize" :total="data[0]?.row_count ?? 0" />
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>