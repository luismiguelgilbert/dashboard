<script setup lang="ts">
const props = defineProps<{
  item: sys_companies;
  itemSelectedId: string | undefined;
}>();

const emit = defineEmits<{
  (e: 'itemSelected', value: sys_companies): void
}>()
</script>

<template>
  <div
    class="p-2 pl-5 pr-6 text-sm cursor-pointer border-l-2 transition-colors border-b border-b-default"
    :class="[
      props.itemSelectedId === props.item.id ? 'border-primary bg-primary/10' : 'border-(--ui-bg) hover:border-l-primary hover:bg-primary/5'
    ]"
    @click="emit('itemSelected', props.item)">
    <div class="flex items-center justify-between">
      <div class="w-full grid grid-flow-col grid-rows-3 items-center overflow-hidden whitespace-pre text-ellipsis max-w-4/5 ">
        <div class="flex items-center font-medium">
          <p class="font-semibold text-highlighted">
            {{ props.item.name_es_short }}
          </p>
        </div>
        <p class="line-clamp-1">
          {{ props.item.name_es }}
        </p>
        <p class="text-dimmed line-clamp-1">
          <span class="flex items-end gap-x-2">
            {{ props.item.company_number }}
          </span>
        </p>
      </div>
      <UChip :color="props.item.is_active ? 'primary' : 'error'" inset size="2xl">
        <UAvatar v-if="props.item.avatar_url" :src="`${props.item.avatar_url}`" size="2xl" />
        <UAvatar v-else-if="props.item.name_es_short" :alt="`${props.item.name_es_short[0]}`" size="2xl" />
      </UChip>
    </div>
  </div>
</template>
