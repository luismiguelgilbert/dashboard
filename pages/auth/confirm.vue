<script setup lang="ts">
const user = useSupabaseUser()

watch(user, () => {
  if (user.value) {
    return navigateTo('/')
  }
}, { immediate: true })
</script>

<template>
  <div>Esperando for login...</div>
</template>