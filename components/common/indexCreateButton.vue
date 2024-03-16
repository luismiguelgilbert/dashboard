<script setup lang="ts">
import type { DropdownItem } from '#ui/types'

defineProps({
  mainAction: {
    type: Object as PropType<DropdownItem>,
    required: false,
    default: () => ({})
  },
  actions: {
    type: Array as PropType<DropdownItem[][]>,
    required: false,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    required: false,
    default: false
  },
});
</script>

<template>  
  <UButtonGroup size="sm" orientation="horizontal">
    <UButton color="white" :label="mainAction.label" @click="mainAction.click"  :loading="isLoading">
      <template #leading v-if="!isLoading">
        <i :class="`${mainAction.icon} hidden sm:block`" />
      </template>
    </UButton>
    <UDropdown :items="actions" :popper="{ placement: 'bottom-start' }" >
      <UButton color="gray" trailing-icon="i-heroicons-chevron-down-20-solid" />
    </UDropdown>
  </UButtonGroup>
</template>