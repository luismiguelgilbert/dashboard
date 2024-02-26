<script setup lang="ts">
const tab = ref('user')
const tabs = [
  { slot: 'user', value: 'user', label: 'Usuario', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { slot: 'colors', value: 'colors',label: 'Color', icon: 'i-heroicons-swatch', defaultOpen: false },
]
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Usuario" />
      <BTabs
        v-model="tab"
        :items="tabs"
      />
      <UDashboardPanelContent>
        <HomeUser v-if="tab === 'user'" />
        <HomeColor v-if="tab === 'colors'" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>