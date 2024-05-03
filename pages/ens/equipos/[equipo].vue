<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <span>Equipo: {{ route.params.equipo }}</span>
</template>