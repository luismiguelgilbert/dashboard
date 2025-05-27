<script setup lang="ts">
import { vInfiniteScroll } from '@vueuse/components';

const emits = defineEmits(['row-clicked']);
const store = useSecurityCompaniesStore();
const { queryPayload, computedQueryKey, selectedRecordId } = storeToRefs(store);
const headers = useRequestHeaders(['cookie']);

const {
  data,
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
const canLoadMore = () => !isFetching.value;
</script>

<template>
  <div
    v-infinite-scroll="[onLoadMore, { distance: 1, canLoadMore }]"
    style="height: calc(100dvh - 65px); overflow-y: auto;"
    class="divide-y divide-default">
    <div
      v-for="item in data?.pages.flatMap(page => page)"
      :key="item ? item.id : 0">
      <CompaniesListItem
        :item="item"
        :item-selected-id="selectedRecordId || undefined"
        @item-selected="($event) => emits('row-clicked', $event)" />
    </div>
    <UProgress v-if="isFetching" class="p-3" />
  </div>
</template>
