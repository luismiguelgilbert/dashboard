<script setup lang="ts">
const headers = useRequestHeaders(['cookie']);
const store = useSecurityProfilesStore();
const { computedRecordQueryKey, selectedRowData, selectedRecordId, isLoading } = storeToRefs(store);

const {
  data,
  isFetching,
} = useQuery({
  queryKey: computedRecordQueryKey,
  queryFn: () => $fetch('/api/security/profile', { method: 'post', headers, body: { id: selectedRecordId.value } }),
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// Keep useQuery props synced with Pinia store
watch(() => data.value, newData => selectedRowData.value = newData ? { ...newData } : undefined, { deep: true, immediate: true });
watch(() => isFetching.value, newData => isLoading.value = newData, { deep: true, immediate: true });
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <UProgress v-if="isFetching" class="p-3" />
    <ProfileFormContentBasic
      v-if="selectedRecordId && selectedRowData"
      :disable="isLoading" />
  </div>
</template>
