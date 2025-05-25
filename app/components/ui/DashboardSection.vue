<script setup lang="ts">
const props = defineProps<{
  name: string;
  label: string;
  hint?: string;
}>();
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center px-0 md:px-5">
    <div>
      <div class="flex content-center items-center justify-between">
        <label class="block font-medium text-left text-(--ui-text)">
          {{ props.label }}
        </label>
      </div>
      <div class="flex content-center items-center justify-between text-left text-(--ui-text-muted)">
        {{ props.hint }}
      </div>
      <slot name="hint-content" />
    </div>
    <div class="relative">
      <UFormField
        size="xl"
        :name="props.name">
        <slot />
      </UFormField>
    </div>
  </div>
</template>
