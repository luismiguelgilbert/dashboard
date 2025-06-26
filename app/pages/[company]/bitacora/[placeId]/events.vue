<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
import type { CheckboxGroupItem } from '@nuxt/ui';

const { currentRoute, push } = useRouter();
const queryClient = useQueryClient();
const userCompany = useState<sys_companies | undefined>('userCompany');
const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');
const store = useBitacoraEventsStore();
const { computedQueryKey, queryPayload, hasFilter, canCreate, canDownload } = storeToRefs(store);
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('lg');
const isFormPanelOpen = computed<boolean>(() => !!currentRoute.value.params.id);
const statusOptions = ref<CheckboxGroupItem[]>([
  { label: 'Activos', value: 'True' },
  { label: 'Inactivos', value: 'False' },
]);

const openNew = async () => {
  const newUniqueId = crypto.randomUUID();
  await navigateTo({ name: 'company-bitacora-events-id', params: { id: newUniqueId }, query: { ...useRoute().query } })
};

const downloadFile = async () => {
  try {
    const response: Blob = await $fetch(`/api/${userCompany.value?.id}/bitacora/${userBitaPlace.value?.id}/events-download`, {
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
    link.setAttribute('download', 'Motivos.xlsx');
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
      const parsedQuery = bitacora_events_query_schema.parse(currentRoute.value.query);
      push({ query: parsedQuery, replace: true });
      queryPayload.value = parsedQuery;
    } else {
      const parsedQuery = bitacora_events_query_schema.parse(queryPayload.value);
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
    id="event-1"
    :default-size="35"
    :min-size="25"
    :max-size="35"
    resizable>
    <UDashboardNavbar title="Eventos">
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
          :sort-items="bitacora_events_sort_enum_client"
          :can-create="canCreate"
          :can-download="canDownload"
          @open-new="openNew"
          @download-file="downloadFile"
          @invalidate-cache="queryClient.invalidateQueries({ queryKey: [computedQueryKey] })">
          <template #FilterSection>
            <UFormField label="Eventos:">
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
      <EventsList @row-clicked="async (row) => await navigateTo({ name: 'company-bitacora-events-id', params: { id: row.id }, query: { ...useRoute().query } })" />
    </ClientOnly>
  </UDashboardPanel>

  <div
    v-if="!isMobile && !isFormPanelOpen"
    class="hidden lg:flex flex-1 items-center justify-center">
    <UIcon name="i-lucide-notebook-pen" class="size-32 text-dimmed" />
  </div>

  <UDashboardPanel
    v-if="!isMobile && isFormPanelOpen"
    id="event-2">
    <ClientOnly>
      <NuxtPage />
    </ClientOnly>
  </UDashboardPanel>

  <USlideover
    v-if="isMobile && isFormPanelOpen"
    class="pt-safe"
    :ui="{ body: 'flex-1 overflow-y-auto p-0' }"
    :open="true"
    @update:open="navigateTo({ name: 'company-bitacora-events', query: { ...useRoute().query } })">
    <template #content>
      <ClientOnly>
        <NuxtPage />
      </ClientOnly>
    </template>
  </USlideover>
</template>
