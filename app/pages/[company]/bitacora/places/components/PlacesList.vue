<script setup lang="ts">
const emits = defineEmits(['row-clicked']);
const store = useBitacoraPlacesStore();
const { queryPayload, computedQueryKey } = storeToRefs(store);
const headers = useRequestHeaders(['cookie']);
const userCompany = useState<sys_companies | undefined>('userCompany');
const errorFetching = ref(false);
const errorFetchingMessage = ref('');

const fetcher = async (pageParam: number) => {
  const { data, error } = await useFetch(`/api/${userCompany.value?.id}/bitacora/places`, { method: 'post', headers, body: JSON.stringify({ ...queryPayload.value, page: pageParam }) })
  if (error.value) {
    errorFetching.value = true;
    errorFetchingMessage.value = error.value?.message || 'An error occurred while fetching data';
  }
  return data.value;
}

const {
  data,
  isStale,
  dataUpdatedAt,
  fetchNextPage,
  isFetching,
  hasNextPage,
} = useInfiniteQuery({
  queryKey: [computedQueryKey.value, userCompany.value?.id, queryPayload],
  queryFn: ({ pageParam }) => fetcher(pageParam),
  initialPageParam: 1,
  getNextPageParam: (lastPage, pages) => lastPage && lastPage.length > 0 ? pages.length + 1 : undefined,
  staleTime: 1000 * 60 * 5, // 5 minutes
});

const onLoadMore = async () => {
  if (isStale.value || hasNextPage.value) {
    await fetchNextPage();
  }
};
</script>

<template>
  <div>
    <UPageCard
      v-if="errorFetching"
      class="m-2 bg-red-500 text-white">
      {{ errorFetchingMessage }}
    </UPageCard>
    <div
      v-if="!errorFetching"
      v-infinite-scroll="[onLoadMore, { distance: 0, canLoadMore: () => true }]"
      style="height: calc(100dvh - 65px); overflow-y: auto;">
      <template v-for="page in data?.pages">
        <PlacesListItem
          v-for="item in page"
          :key="`${dataUpdatedAt}-${item.id}`"
          :item="item"
          @item-selected="($event) => emits('row-clicked', $event)" />
      </template>
      <UProgress v-if="isFetching" class="p-3" />
    </div>
  </div>
</template>
