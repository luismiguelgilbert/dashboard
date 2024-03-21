<script setup lang="ts">
import type { DropdownItemExtended } from '~/types/client/DropdownItemExtended';

const props = defineProps({
  actions: {
    type: Array as PropType<DropdownItemExtended[][]>,
    required: false,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    required: false,
    default: false
  },
});

const mainAction = props.actions[0].find(x => x.isMainAction);
const nonMainActions = [props.actions[0].filter(x => !x.isMainAction)];
</script>

<template>
  <UButtonGroup size="sm" orientation="horizontal">
    <UButton
      v-if="mainAction"
      color="white"
      :label="mainAction.label"
      :loading="isLoading"
      :disabled="mainAction.disabled"
      @click="mainAction.click">
      <template #leading v-if="!isLoading">
        <i :class="`${mainAction.icon} hidden sm:block`" />
      </template>
    </UButton>
    <UDropdown
      :items="nonMainActions"
      :popper="{ placement: 'bottom-start' }" >
      <UButton color="gray" trailing-icon="i-heroicons-chevron-down-20-solid" />
    </UDropdown>
  </UButtonGroup>
</template>