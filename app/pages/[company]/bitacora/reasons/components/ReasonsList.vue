<script setup lang="ts">
import { vInfiniteScroll } from '@vueuse/components';
import type { bitacora_reasons } from '@@/shared/types/bitacora_reasons';

const emits = defineEmits<{'row-clicked': [row: bitacora_reasons]}>();
const { currentRoute } = useRouter();
const { dataList, dataListError, dataListStale, dataListFetching, dataUpdatedAt, fetchNextPage, hasNextPage } = useBitacoraReasonsQueries();

const onLoadMore = async () => {
  if (dataListStale.value || hasNextPage.value) {
    await fetchNextPage();
  }
};
</script>

<template>
  <div>
    <UPageCard
      v-if="dataListError"
      class="m-2 bg-red-500 text-white">
      {{ dataListError.message }}
    </UPageCard>
    <div
      v-if="!dataListError"
      v-infinite-scroll="[onLoadMore, { distance: 0, canLoadMore: () => true }]"
      style="height: calc(100dvh - 65px); overflow-y: auto;">
      <template v-for="page in dataList?.pages">
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
      <UProgress v-if="dataListFetching" class="p-3" />
    </div>
  </div>
</template>
