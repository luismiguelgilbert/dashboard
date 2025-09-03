<script setup lang="ts">
import { DateTime } from 'luxon';
import { vInfiniteScroll } from '@vueuse/components';
import type { bitacora_rides } from '@@/shared/types/bitacora_rides';

const emits = defineEmits<{'row-clicked': [row: bitacora_rides]}>();
const { currentRoute } = useRouter();
const { dataList, dataListError, dataListStale, dataListFetching, dataUpdatedAt, fetchNextPage, hasNextPage } = useBitacoraRidesQueries();

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
            :name="`${item.name_es} (${ item.name_es_short })`"
            :description="item.reason_name
              ? `${item.reason_name} - ${item.ride_start ? DateTime.fromSQL(item.ride_start).setLocale('es-EC').toFormat('dd/MMMM/yyyy HH:mm') : ''}`
              : ''"
            :avatar="{
              icon: (item.reason_id?.length || 0 > 0) ? 'i-lucide-octagon-minus' : 'i-lucide-check',
              class: (item.reason_id?.length || 0 > 0) ? 'bg-red-400' : undefined,
              ui: { icon: (item.reason_id?.length || 0 > 0) ? 'text-white' : undefined }
            }"
            @click="emits('row-clicked', item)" />
        </div>
      </template>
      <UProgress v-if="dataListFetching" class="p-3" />
    </div>
  </div>
</template>
