<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
import type { CheckboxGroupItem } from '@nuxt/ui';
import type { sys_companies } from '@@/shared/types/sys_companies';

const { currentRoute, push } = useRouter();
const queryClient = useQueryClient();
const store = useSecurityCompaniesStore();
const { computedQueryKey, queryPayload, hasFilter, canCreate, canDownload } = storeToRefs(store);
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('lg');
const isFormPanelOpen = computed<boolean>(() => !!currentRoute.value.params.id);
const statusOptions = ref<CheckboxGroupItem[]>([
  { label: 'Activas', value: 'True' },
  { label: 'Inactivas', value: 'False' },
]);

const openNew = async () => {
  const newUniqueId = crypto.randomUUID();
  await navigateTo({ name: 'security-companies-id', params: { id: newUniqueId }, query: { ...useRoute().query } })
};

const downloadFile = async () => {
  try {
    const response: Blob = await $fetch('/api/security/companies-download', {
      method: 'POST',
      body: {
        ...queryPayload.value,
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

onBeforeMount(() => {
  try {
    if (Object.keys(currentRoute.value.query).length) {
      const parsedQuery = sys_companies_query_schema.parse(currentRoute.value.query);
      push({ query: parsedQuery, replace: true });
      queryPayload.value = parsedQuery;
    } else {
      const parsedQuery = sys_companies_query_schema.parse(queryPayload.value);
      push({ query: parsedQuery, replace: true });
    }
  } catch {
    push({ query: {} });
    useToast().add({ color: 'info', orientation: 'horizontal', icon: 'i-lucide-info', description: 'Por su seguridad, hemos quitado los parámetros de búsqueda.' });
  }
});
</script>

<template>
  <UDashboardPanel
    id="company-1"
    :default-size="27"
    :min-size="25"
    :max-size="35"
    resizable
    class="lg:ml-5 border-l border-l-neutral-200 dark:border-l-neutral-800">
    <UDashboardNavbar title="Organizaciones">
      <template #leading>
        <UDashboardSidebarCollapse class="cursor-pointer" />
      </template>
      <template #trailing>
        <UBadge v-if="hasFilter" icon="i-lucide-filter" variant="subtle" />
      </template>
      <template #right>
        <UiListToolbar
          v-model:search="queryPayload.search"
          v-model:sort="queryPayload.sort"
          v-model:order="queryPayload.order"
          :sort-items="sys_companies_sort_enum_client"
          :can-create="canCreate"
          :can-download="canDownload"
          @open-new="openNew"
          @download-file="downloadFile"
          @invalidate-cache="queryClient.invalidateQueries({ queryKey: [computedQueryKey] })">
          <template #FilterSection>
            <UFormField label="Organizaciones:">
              <template #hint>
                <UButton
                  label="Quitar"
                  class="cursor-pointer"
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  icon="i-lucide-eraser"
                  @click="() => {
                    queryPayload.is_active = undefined;
                    push({ query: { ...currentRoute.query, is_active: undefined } })
                  }" />
              </template>
              <USelectMenu
                v-model="queryPayload.is_active"
                class="w-full"
                value-key="value"
                size="xl"
                multiple
                :search-input="false"
                :items="statusOptions"
                @update:model-value="() => push({ query: { ...currentRoute.query, is_active: queryPayload.is_active || undefined } })" />
            </UFormField>
          </template>
        </UiListToolbar>
      </template>
    </UDashboardNavbar>
    <ClientOnly>
      <CompaniesList @row-clicked="async (row: sys_companies) => await navigateTo({ name: 'security-companies-id', params: { id: row.id }, query: { ...useRoute().query } })" />
    </ClientOnly>
  </UDashboardPanel>

  <div
    v-if="!isMobile && !isFormPanelOpen"
    class="hidden lg:flex flex-1 items-center justify-center">
    <UIcon name="i-lucide-building-2" class="size-32 text-dimmed" />
  </div>

  <UDashboardPanel
    v-if="!isMobile && isFormPanelOpen"
    id="company-2">
    <ClientOnly>
      <NuxtPage />
    </ClientOnly>
  </UDashboardPanel>

  <USlideover
    v-if="isMobile && isFormPanelOpen"
    class="pt-safe"
    :ui="{ body: 'flex-1 overflow-y-auto p-0' }"
    :open="true"
    @update:open="navigateTo({ name: 'security-companies', query: { ...useRoute().query } })">
    <template #content>
      <ClientOnly>
        <NuxtPage />
      </ClientOnly>
    </template>
  </USlideover>
</template>
