<script setup lang="ts">
const headers = useRequestHeaders(['cookie']);
const store = useSecurityCompaniesStore();
const { selectedRowData } = storeToRefs(store);
const recordId = computed(() => useRoute().query.id);
const computedQueryKey = computed<string>(() => `security-companies-${recordId.value}`);

const {
  data,
  isFetching,
} = useQuery({
  queryKey: [computedQueryKey],
  queryFn: () => $fetch('/api/security/company', { method: 'post', headers, body: { id: recordId.value } }),
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// watch "data" and set "selectedRowData" when it changes
watch(data, (newData) => {
  if (newData) {
    selectedRowData.value = newData;
  }
});
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <UProgress v-if="isFetching" class="p-3" />
    <CompanyFormContentBasic
      id="formBasic"
      ref="formBasic"
      :disable="false" />
    <CompanyFormContentAvatar :disable="false" />
  </div>
</template>
