<script setup lang="ts">
const props = defineProps<{
  disable: boolean;
}>();

const moduleStore = useBitacoraPlacesStore();
const { selectedRowData } = storeToRefs(moduleStore);
</script>

<template>
  users: {{ selectedRowData }}
</template>