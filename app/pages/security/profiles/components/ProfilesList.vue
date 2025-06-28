<script setup lang="ts">
import { vInfiniteScroll } from '@vueuse/components';

const emits = defineEmits(['row-clicked']);
const { currentRoute } = useRouter();
const store = useSecurityProfilesStore();
const { queryPayload, computedQueryKey } = storeToRefs(store);
const headers = useRequestHeaders(['cookie']);
const errorFetching = ref(false);
const errorFetchingMessage = ref('');

const fetcher = async (pageParam: number) => {
  const { data, error } = await useFetch('/api/security/profiles', { method: 'post', headers, body: JSON.stringify({ ...queryPayload.value, page: pageParam }) })
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
  queryKey: [computedQueryKey.value, queryPayload],
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
        <div
          v-for="item in page"
          :key="`${dataUpdatedAt}-${item.id}`"
          class="text-sm cursor-pointer border-l-2 transition-colors border-b border-b-default overflow-x-hidden"
          :class="[
            currentRoute.params.id === item.id ? 'border-primary bg-primary/10' : 'border-(--ui-bg) hover:border-l-primary hover:bg-primary/5'
          ]">
          <UUser
            class="p-3 pl-3 pr-6"
            :name="item.name_es"
            :description="`Número de usuarios: ${item.profile_users_count}`"
            :avatar="{
              alt: item.name_es[0],
            }"
            :chip=" {
              color: item.is_active ? 'primary' : 'error',
              position: 'top-right'
            }"
            @click="emits('row-clicked', item)" />
        </div>
      </template>
      <UProgress v-if="isFetching" class="p-3" />
    </div>
  </div>
</template>
