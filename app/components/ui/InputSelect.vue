<script setup lang="ts">
const props = defineProps<{
  disabled?: boolean;
  title?: string;
}>();
const emit = defineEmits(['save']);

const open = ref(false)
const closeDrawer = () => open.value = false;

defineExpose({ closeDrawer });
</script>

<template>
  <UButtonGroup class="w-full">
    <slot name="selectMenu" />
    <UButton
      color="neutral"
      class="cursor-pointer"
      variant="subtle"
      icon="i-lucide-circle-plus"
      size="lg"
      :disabled="props.disabled"
      @click="open = true" />
  </UButtonGroup>
  <UDrawer
    v-model:open="open"
    direction="right">
    <template #body>
      <div class="min-w-96">
        <slot name="draw-content" />
      </div>
    </template>
    <template #header>
      <div class="flex justify-between">
        <span class="flex items-center">
          <UButton
            icon="i-lucide-circle-x"
            color="neutral"
            variant="link"
            class="-ms-1.5 cursor-pointer"
            @click="open = false" />
          {{ props.title || 'Agregar' }}
        </span>
        <UButton
          label="Agregar"
          icon="i-lucide-circle-plus"
          color="neutral"
          @click="emit('save')" />
      </div>
    </template>
  </UDrawer>
</template>