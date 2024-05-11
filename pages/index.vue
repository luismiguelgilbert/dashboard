<script setup lang="ts">
const tab = ref('user');
const tabs = [
  { value: 'user', label: 'Usuario', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { value: 'settings',label: 'Ajustes', icon: 'i-heroicons-adjustments-vertical', defaultOpen: false },
];
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
        <HomeSettings v-if="tab === 'settings'" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>