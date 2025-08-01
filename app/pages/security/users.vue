<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
import { useQueryClient } from '@tanstack/vue-query';
import type { CheckboxGroupItem } from '@nuxt/ui';

const { currentRoute, push } = useRouter();
const queryClient = useQueryClient();
const store = useSecurityUsersStore();
const { computedQueryKey, queryPayload, hasFilter, canCreate, canDownload } = storeToRefs(store);
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('lg');
const isFormPanelOpen = computed<boolean>(() => !!currentRoute.value.params.id);
const statusOptions = ref<CheckboxGroupItem[]>([
  { label: 'Activos', value: 'True' },
  { label: 'Inactivos', value: 'False' },
]);
const userSexOptions = ref<CheckboxGroupItem[]>([
  { label: 'Hombres', value: 'True' },
  { label: 'Mujeres', value: 'False' },
]);

const openNew = async () => {
  const newUniqueId = crypto.randomUUID();
  await navigateTo({ name: 'security-users-id', params: { id: newUniqueId }, query: { ...useRoute().query } })
};

const downloadFile = async () => {
  try {
    const response: Blob = await $fetch('/api/security/users-download', {
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
    link.setAttribute('download', 'Usuarios.xlsx');
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
      const parsedQuery = sys_users_query_schema.parse(currentRoute.value.query);
      push({ query: parsedQuery, replace: true });
      queryPayload.value = parsedQuery;
    } else {
      const parsedQuery = sys_users_query_schema.parse(queryPayload.value);
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
    id="user-1"
    :default-size="25"
    :min-size="25"
    :max-size="35"
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
          v-model:search="queryPayload.search"
          v-model:sort="queryPayload.sort"
          v-model:order="queryPayload.order"
          :sort-items="sys_users_sort_enum_client"
          :can-create="canCreate"
          :can-download="canDownload"
          @open-new="openNew"
          @download-file="downloadFile"
          @invalidate-cache="queryClient.invalidateQueries({ queryKey: [computedQueryKey] })">
          <template #FilterSection>
            <UFormField label="Usuarios:">
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
            <UFormField label="Sexo:">
              <template #hint>
                <UButton
                  label="Quitar"
                  class="cursor-pointer"
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  icon="i-lucide-eraser"
                  @click="() => {
                    queryPayload.user_sex = undefined;
                    push({ query: { ...currentRoute.query, user_sex: undefined } })
                  }" />
              </template>
              <USelectMenu
                v-model="queryPayload.user_sex"
                class="w-full"
                value-key="value"
                size="xl"
                multiple
                :search-input="false"
                :items="userSexOptions"
                @update:model-value="() => push({ query: { ...currentRoute.query, user_sex: queryPayload.user_sex || undefined } })" />
            </UFormField>
          </template>
        </UiListToolbar>
      </template>
    </UDashboardNavbar>
    <ClientOnly>
      <UsersList @row-clicked="async (row) => await navigateTo({ name: 'security-users-id', params: { id: row.id }, query: { ...useRoute().query } })" />
    </ClientOnly>
  </UDashboardPanel>

  <div
    v-if="!isMobile && !isFormPanelOpen"
    class="hidden lg:flex flex-1 items-center justify-center">
    <UIcon name="i-lucide-users-round" class="size-32 text-dimmed" />
  </div>

  <UDashboardPanel
    v-if="!isMobile && isFormPanelOpen"
    id="user-2">
    <ClientOnly>
      <NuxtPage />
    </ClientOnly>
  </UDashboardPanel>

  <USlideover
    v-if="isMobile && isFormPanelOpen"
    class="pt-safe"
    :ui="{ body: 'flex-1 overflow-y-auto p-0' }"
    :open="true"
    @update:open="navigateTo({ name: 'security-users', query: { ...useRoute().query } })">
    <template #content>
      <ClientOnly>
        <NuxtPage />
      </ClientOnly>
    </template>
  </USlideover>
</template>
