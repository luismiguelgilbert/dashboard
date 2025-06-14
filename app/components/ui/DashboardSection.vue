<script setup lang="ts">
const props = defineProps<{
  name: string;
  label: string;
  labelTop?: boolean;
  hint?: string;
  vertical?: boolean;
}>();

const {
  name,
  label,
  labelTop,
  hint,
  vertical,
} = toRefs(props);
</script>

<template>
  <div
    class="grid gap-5 px-0 md:px-5"
    :class="{
      'items-start': labelTop,
      'items-center': !labelTop,
      'grid-cols-1': vertical,
      'grid-cols-1 sm:grid-cols-2': !vertical
    }">
    <div>
      <div class="flex content-center items-center justify-between">
        <label class="block font-medium text-left text-(--ui-text)">
          {{ label }}
        </label>
      </div>
      <div class="flex content-center items-center justify-between text-left text-(--ui-text-muted)">
        {{ hint }}
      </div>
      <slot name="hint-content" />
    </div>
    <div class="relative">
      <UFormField
        size="xl"
        :name="name">
        <slot />
      </UFormField>
    </div>
  </div>
</template>
