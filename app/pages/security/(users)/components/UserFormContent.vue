<script setup lang="ts">
const headers = useRequestHeaders(['cookie']);
const store = useSecurityUsersStore();
const { computedRecordQueryKey, selectedRowData, selectedRecordId, isLoading } = storeToRefs(store);
const selectedTab = ref<'basic' | 'permissions'>('permissions');
const links = computed(() => {
  return [[
    {
      label: 'Datos del Usuario',
      icon: 'i-lucide-user',
      class: 'cursor-pointer',
      active: selectedTab.value === 'basic',
      onSelect: () => { selectedTab.value = 'basic' },
    },
    {
      label: 'Permisos',
      icon: 'i-lucide-shield-user',
      class: 'cursor-pointer',
      active: selectedTab.value === 'permissions',
      onSelect: () => { selectedTab.value = 'permissions' },
    }
  ]];
});

const {
  data,
  isFetching,
} = useQuery({
  queryKey: computedRecordQueryKey,
  queryFn: () => $fetch('/api/security/user', { method: 'post', headers, body: { id: selectedRecordId.value } }),
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// Keep useQuery props synced with Pinia store
watch(() => data.value, newData => selectedRowData.value = newData ? { ...newData } : undefined, { deep: true, immediate: true });
watch(() => isFetching.value, newData => isLoading.value = newData, { deep: true, immediate: true });
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <UProgress v-if="isFetching" class="p-3" />
    <UDashboardToolbar v-if="selectedRecordId && selectedRowData">
      <UNavigationMenu
        :items="links"
        class="-mx-1 flex-1"
        highlight />
    </UDashboardToolbar>
    <template v-if="selectedTab === 'basic'">
      <UserFormContentBasic
        v-if="selectedRecordId && selectedRowData"
        :disable="isLoading" />
      <UserFormContentAvatar
        v-if="selectedRecordId && selectedRowData"
        :disable="isLoading" />
    </template>
    <template v-if="selectedTab === 'permissions'">
      <UserFormContentAccess
        v-if="selectedRecordId && selectedRowData"
        :disable="false" />
    </template>
  </div>
</template>
