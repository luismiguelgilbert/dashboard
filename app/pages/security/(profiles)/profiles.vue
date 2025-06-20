<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core';

const breakpoints = useBreakpoints(breakpointsTailwind);
const queryClient = useQueryClient();
const isMobile = breakpoints.smaller('lg');
const store = useSecurityProfilesStore();
const {
  sortItems,
  queryPayload,
  computedQueryKey,
  isLoading,
  selectedRecordId,
  selectedRowData,
  hasFilter,
  filterActiveItems,
  isSaveDisabled,
  formPanelTitle,
  canCreate,
  canDownload,
} = storeToRefs(store);
const isFormPanelOpen = computed<boolean>(() => !!selectedRecordId.value);

const downloadFile = async () => {
  try {
    const response: Blob = await $fetch('/api/security/profiles-download', {
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
    link.setAttribute('download', 'Perfiles.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    useToast().add({
      title: 'Error',
      description: `Error al descargar el archivo. (${error})`,
      icon: 'i-lucide-shield-alert',
      type: 'foreground',
      color: 'error',
    });
    console.error(error);
  }
};

const openNew = () => {
  const newUniqueId = crypto.randomUUID();
  selectedRowData.value = sys_profiles_schema.safeParse({ id: newUniqueId, is_new: true }).data;
  useRouter().push({ query: { id: newUniqueId, is_new: 'true' } });
  selectedRecordId.value = newUniqueId;
}

const openEdit = (row: sys_profiles) => {
  selectedRecordId.value = row.id;
  selectedRowData.value = sys_profiles_schema.parse({});
  useRouter().push({ query: { id: row.id } });
};

const closeForm = () => {
  selectedRowData.value = undefined;
  selectedRecordId.value = undefined;
  useRouter().replace({ query: undefined });
};

const { mutateAsync, isPending } = useMutation({
  mutationFn: () => $fetch('/api/security/profile-upsert', { method: 'POST', body: selectedRowData.value }),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['security-profiles-record'] });
    // this optimisticly updates the cache data record to reflect changes in the list component
    queryClient.setQueryData(computedQueryKey.value, (oldData: { pages: sys_profiles[][], pageParams: number[] }) => {
      oldData.pages.forEach((page) => {
        const recordIndex = page.findIndex(user => user.id === selectedRowData.value?.id);
        if (page[recordIndex]) {
          page[recordIndex] = {
            ...page[recordIndex],
            // Update fields used in the list component
            name_es: String(selectedRowData.value?.name_es),
            is_active: Boolean(selectedRowData.value?.is_active),
          };
        }
      });
      return oldData;
    });
  },
});

const saveForm = async () => {
  try {
    if (selectedRowData.value) {
      selectedRowData.value.is_saving = true;
      const { error } = sys_profiles_schema.safeParse(selectedRowData.value);
      if (error) throw error.issues.map(err => `- ${err.message}`).join('.\n    ');
      await mutateAsync();
      selectedRowData.value.is_saving = false;
      useRouter().replace({ query: { id: selectedRowData.value.id } });
      useToast().add({
        title: 'Datos guardados',
        icon: 'i-lucide-circle-check',
        color: 'success',
      });
    }
  } catch (error) {
    useToast().add({
      title: 'Error al guardar',
      description: `Revise sus datos y vuelva a intentarlo: \n ${error}`,
      icon: 'i-lucide-alert-triangle',
      color: 'error',
      ui: { description: 'text-sm text-muted whitespace-pre-line' }
    });
    console.error(error);
  }
};

const invalidateCache = () => {
  queryClient.invalidateQueries({ queryKey: computedQueryKey.value });
};

watch(() => isPending.value, newData => isLoading.value = newData, { deep: true, immediate: true });
// on mounted, set the selectedRowData the same ID available in the URl query string parameter (if exists)
onMounted(() => {
  const recordId = useRoute().query.id?.toLocaleString() || store.selectedRecordId;
  const is_new = useRoute().query.is_new?.toLocaleString() === 'true' || selectedRowData.value?.is_new;
  if (recordId) {
    selectedRecordId.value = recordId as string;
    useRouter().push({ query: { id: recordId, is_new: is_new ? 'true' : undefined } });
  }
  if (is_new) {
    selectedRowData.value = sys_profiles_schema.safeParse({ id: selectedRecordId.value, is_new }).data;
  }
});
</script>

<template>
  <UDashboardPanel
    id="prorile-1"
    :default-size="35"
    :min-size="25"
    :max-size="35"
    resizable>
    <UDashboardNavbar title="Perfiles">
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
          v-model:sort-by-order="queryPayload.sortByOrder"
          :sort-items="sortItems"
          :filter-times="[filterActiveItems]"
          :can-create="canCreate"
          :can-download="canDownload"
          @open-new="openNew"
          @download-file="downloadFile"
          @invalidate-cache="invalidateCache">
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
              </template>
            </UPageCard>
          </template>
        </UiListToolbar>
      </template>
    </UDashboardNavbar>
    <div class="overflow-y-auto">
      <ClientOnly>
        <ProfilesList @row-clicked="openEdit" />
      </ClientOnly>
    </div>
  </UDashboardPanel>

  <ProfileForm
    v-if="isFormPanelOpen && !isMobile"
    :title="formPanelTitle"
    @close-clicked="closeForm"
    @save-clicked="saveForm" />
  <div v-else class="hidden lg:flex flex-1 items-center justify-center">
    <UIcon name="i-lucide-shield-user" class="size-32 text-dimmed" />
  </div>

  <ClientOnly>
    <USlideover
      v-if="isFormPanelOpen && isMobile"
      class="pt-safe"
      :open="isFormPanelOpen">
      <template #header>
        <div class="flex w-full justify-between items-center">
          <span class="text-lg font-semibold">
            {{ formPanelTitle }}
          </span>
          <UButton
            class="cursor-pointer"
            icon="i-lucide-x"
            size="xl"
            color="neutral"
            variant="soft"
            @click="closeForm" />
        </div>
      </template>
      <template #body>
        <ProfileFormContent />
      </template>
      <template #footer>
        <div class="flex w-full justify-between">
          <UButton
            class="cursor-pointer"
            label="Cerrar"
            color="neutral"
            variant="soft"
            icon="i-lucide-circle-x"
            size="xl"
            :disabled="isLoading"
            :loading="isLoading"
            @click="closeForm" />
          <UButton
            class="cursor-pointer"
            label="Guardar"
            icon="i-lucide-save"
            color="neutral"
            size="xl"
            :disabled="isSaveDisabled"
            :loading="isLoading"
            @click="saveForm" />
        </div>
      </template>
    </USlideover>
  </ClientOnly>
</template>
