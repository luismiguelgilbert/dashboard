<script setup lang="ts">
const props = defineProps<{
  item: sys_profiles;
  itemSelectedId: string | undefined;
}>();

const emit = defineEmits<{
  (e: 'itemSelected', value: sys_profiles): void
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
            {{ props.item.name_es }}
          </p>
        </div>
        <p class="line-clamp-1 tabular-nums">
          {{ `Número de usuarios: ${props.item.profile_users_count}` }}
        </p>
      </div>
      <UChip :color="props.item.is_active ? 'primary' : 'neutral'" inset size="2xl">
        <UAvatar :alt="`${props.item.name_es[0]}`" size="2xl" />
      </UChip>
    </div>
  </div>
</template>
