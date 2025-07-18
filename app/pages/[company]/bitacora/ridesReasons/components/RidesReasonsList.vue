<script setup lang="ts">
import { vInfiniteScroll } from '@vueuse/components';

const emits = defineEmits(['row-clicked']);
const { currentRoute } = useRouter();
const { data, error, isStale, dataUpdatedAt, fetchNextPage, isFetching, hasNextPage } = useBitacoraRidesReasonsQueries();

const onLoadMore = async () => {
  if (isStale.value || hasNextPage.value) {
    await fetchNextPage();
  }
};
</script>

<template>
  <div>
    <UPageCard
      v-if="error"
      class="m-2 bg-red-500 text-white">
      {{ error.message }}
    </UPageCard>
    <div
      v-if="!error"
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
