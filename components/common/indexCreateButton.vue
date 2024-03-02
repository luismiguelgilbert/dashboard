<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: false,
    default: 'Nuevo'
  },
  totalRows: {
    type: Number,
    required: false,
    default: 0
  },
  loading: {
    type: Boolean,
    required: false,
    default: false
  },
});
const emit = defineEmits(['new'])

</script>

<template>  
  <UButtonGroup size="sm" orientation="horizontal">
    <UButton color="gray" :label="label" @click="emit('new')" :loading="loading">
      <template #leading v-if="!loading">
        <i class="i-heroicons-plus hidden sm:block" />
      </template>
    </UButton>
    <UButton icon="i-heroicons-chevron-down-20-solid" color="gray" :loading="loading" />
  </UButtonGroup>
</template>