<script setup lang="ts">
import { vInfiniteScroll } from '@vueuse/components';

const emits = defineEmits(['row-clicked']);
const store = useSecurityCompaniesStore();
const { queryPayload, computedQueryKey, selectedRecordId } = storeToRefs(store);
const headers = useRequestHeaders(['cookie']);

const {
  data,
  dataUpdatedAt,
  fetchNextPage,
  isFetching,
} = useInfiniteQuery({
  queryKey: computedQueryKey,
  queryFn: ({ pageParam }) => $fetch('/api/security/companies', { method: 'post', headers, body: { ...queryPayload.value, page: pageParam } }),
  initialPageParam: 1,
  getNextPageParam: (lastPage, pages) => lastPage.length > 0 ? pages.length + 1 : undefined,
  staleTime: 1000 * 60 * 5, // 5 minutes
});

const onLoadMore = async () => {
  await fetchNextPage();
};
</script>

<template>
  <div
    v-infinite-scroll="[onLoadMore, { distance: 0, canLoadMore: () => true }]"
    style="height: calc(100dvh - 65px); overflow-y: auto;">
    <template v-for="page in data?.pages">
      <CompaniesListItem
        v-for="item in page"
        :key="`${dataUpdatedAt}-${item.id}`"
        :item="item"
        :item-selected-id="selectedRecordId || undefined"
        @item-selected="($event) => emits('row-clicked', $event)" />
    </template>
    <UProgress v-if="isFetching" class="p-3" />
  </div>
</template>
