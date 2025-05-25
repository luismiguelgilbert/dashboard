<script setup lang="ts">
const props = defineProps({
  delay: {
    type: Number,
    default: 1000,
  },
});

const model = defineModel({ default: '', required: true, type: String });

const inputValue = ref(model.value);
const inputValueDebounced = refDebounced(inputValue, props.delay);

watch(inputValueDebounced, (newValue) => {
  model.value = newValue;
});
</script>

<template>
  <UInput
    v-model="inputValue"
    autofocus
    class="w-full"
    icon="i-lucide-search"
    variant="soft"
    size="xl">
    <template v-if="inputValue?.length" #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        icon="i-lucide-circle-x"
        aria-label="Clear input"
        class="cursor-pointer"
        @click="inputValue = ''" />
    </template>
  </UInput>
</template>
