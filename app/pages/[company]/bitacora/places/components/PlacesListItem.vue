<script setup lang="ts">
const props = defineProps<{
  item: bitacora_places;
}>();

const emit = defineEmits<{
  (e: 'itemSelected', value: bitacora_places): void
}>()
const { currentRoute } = useRouter();
</script>

<template>
  <div
    class="p-2 pl-5 pr-6 text-sm cursor-pointer border-l-2 transition-colors border-b border-b-default"
    :class="[
      currentRoute.params.id === props.item.id ? 'border-primary bg-primary/10' : 'border-(--ui-bg) hover:border-l-primary hover:bg-primary/5'
    ]"
    @click="emit('itemSelected', props.item)">
    <div class="flex items-center justify-between">
      <div class="w-full grid grid-flow-col grid-rows-3 items-center overflow-hidden whitespace-pre text-ellipsis max-w-4/5 ">
        <div class="flex items-center font-medium">
          <p class="font-semibold text-highlighted">
            {{ props.item.name_es }}
          </p>
        </div>
        <p class="line-clamp-1">
          {{ props.item.name_es_short }}
        </p>
      </div>
      <UChip :color="props.item.is_active ? 'primary' : 'error'" inset size="2xl">
        <UAvatar v-if="props.item.avatar_url" :src="`${props.item.avatar_url}`" size="2xl" />
        <UAvatar v-else-if="props.item.name_es" :alt="`${props.item.name_es[0]}`" size="2xl" />
      </UChip>
    </div>
  </div>
</template>
