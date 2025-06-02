<script setup lang="ts">
import { vInfiniteScroll } from '@vueuse/components';

const emits = defineEmits(['row-clicked']);
const store = useSecurityUsersStore();
const { queryPayload, computedQueryKey, selectedRecordId } = storeToRefs(store);
const headers = useRequestHeaders(['cookie']);

const {
  data,
  fetchNextPage,
  isFetching,
} = useInfiniteQuery({
  queryKey: computedQueryKey,
  queryFn: ({ pageParam }) => $fetch('/api/security/users', { method: 'post', headers, body: { ...queryPayload.value, page: pageParam } }),
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
    :key="JSON.stringify(computedQueryKey)"
    v-infinite-scroll="[onLoadMore, { distance: 0, canLoadMore: () => true }]"
    style="height: calc(100dvh - 65px); overflow-y: auto;"
    class="divide-y divide-default">
    <div
      v-for="item in data?.pages.flatMap(page => page)"
      :key="item ? item.id : 0">
      <UsersListItem
        :item="item"
        :item-selected-id="selectedRecordId || undefined"
        @item-selected="($event) => emits('row-clicked', $event)" />
    </div>
    <UProgress v-if="isFetching" class="p-3" />
  </div>
</template>
