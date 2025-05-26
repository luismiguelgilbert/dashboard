<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core';

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('lg');
const store = useSecurityUsersStore();
const { sortItems, queryPayload, computedQueryKey, selectedRecordId, selectedRowData, hasFilter, filterActiveItems, filterSexItems } = storeToRefs(store);
const isFormPanelOpen = computed<boolean>(() => !!useRoute().query.id);
const isFormPanelCreating = computed<boolean>(() => !!useRoute().query.is_new);
const formPanelTitle = computed<string>(() => isFormPanelCreating.value ? 'Nuevo usuario' : 'Editar usuario');

const downloadFile = async () => {
  try {
    const response: Blob = await $fetch('/api/security/users-download', {
      method: 'POST',
      body: {
        ...queryPayload.value,
        is_downloading: true,
        page: undefined,
        pageSize: undefined,
      },
    });
    const url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Usuarios.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    useToast().add({
      title: 'Error',
      description: 'Error al descargar el archivo',
      icon: 'i-lucide-shield-alert',
      type: 'foreground',
      color: 'error',
    });
    console.error(error);
  }
};

const openNew = () => {
  const newUniqueId = crypto.randomUUID();
  selectedRowData.value = sys_users_schema.safeParse({ id: newUniqueId, is_new: true }).data;
  selectedRowData.value = sys_users_schema.safeParse({ id: newUniqueId, is_new: true }).data;
  useRouter().push({ query: { id: newUniqueId, is_new: 'true' } });
}
const openEdit = (row: sys_users) => {
  selectedRowData.value = row;
  selectedRecordId.value = row.id;
  useRouter().push({ query: { id: row.id } });
};
const closeForm = () => {
  console.log('closeForm');
  selectedRowData.value = undefined;
  selectedRecordId.value = undefined;
  useRouter().replace({ query: undefined });
};
</script>

<template>
  <UDashboardPanel
    id="user-1"
    :default-size="25"
    :min-size="20"
    :max-size="30"
    resizable>
    <UDashboardNavbar title="Usuarios">
      <template #leading>
        <UDashboardSidebarCollapse class="cursor-pointer" />
      </template>
      <template #trailing>
        <UBadge v-if="hasFilter" icon="i-lucide-filter" variant="subtle" />
      </template>

      <template #right>
        <UiListToolbar
          v-model:search-string="queryPayload.searchString"
          v-model:sort-by="queryPayload.sortBy"
          :sort-items="sortItems"
          :filter-times="[filterActiveItems, filterSexItems]"
          @open-new="openNew"
          @download-file="downloadFile">
          <template #FilterSection>
            <UPageCard
              title="Filtrar lista:"
              variant="soft">
              <template #footer>
                <UCheckboxGroup
                  v-model="queryPayload.filterIsActive"
                  size="xl"
                  value-key="id"
                  :items="filterActiveItems" />
                <br>
                <UCheckboxGroup
                  v-model="queryPayload.filterSex"
                  size="xl"
                  value-key="id"
                  :items="filterSexItems" />
              </template>
            </UPageCard>
          </template>
        </UiListToolbar>
      </template>
    </UDashboardNavbar>
    <div class="overflow-y-auto divide-y divide-default">
      <ClientOnly>
        <UsersList
          :key="computedQueryKey"
          @row-clicked="openEdit" />
      </ClientOnly>
    </div>
  </UDashboardPanel>

  <UserForm
    v-if="isFormPanelOpen && !isMobile"
    :title="formPanelTitle"
    @close-clicked="closeForm" />
  <div v-else class="hidden lg:flex flex-1 items-center justify-center">
    <UIcon name="i-lucide-user" class="size-32 text-dimmed" />
  </div>

  <ClientOnly>
    <USlideover
      v-if="isFormPanelOpen && isMobile"
      class="pt-safe"
      :open="isFormPanelOpen"
      :title="formPanelTitle">
      <template #close>
        <span class="hidden" />
      </template>
      <template #body>
        <UserFormContent />
      </template>
      <template #footer>
        <div class="flex w-full justify-between">
          <UButton
            label="Cancelar"
            color="neutral"
            variant="soft"
            icon="i-lucide-circle-x"
            @click="closeForm" />
          <UButton
            label="Guardar"
            icon="i-lucide-save"
            color="neutral" />
        </div>
      </template>
    </USlideover>
  </ClientOnly>
</template>
