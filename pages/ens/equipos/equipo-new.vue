<script setup lang="ts">
import Basic from './components/basic.vue';
// const isRightPanelOpen = ref(true);
// const tab = ref('basic');
</script>

<template>
  <div>
    <UDashboardPanel
      collapsible
      grow
      side="right">
      <UDashboardNavbar
        title="Crear Equipo"
        class="sticky top-0 z-10 bg-white dark:bg-gray-900">
        <template #toggle>
          <UDashboardNavbarToggle icon="i-heroicons-x-mark" />
        </template>
        <template #right>
          <UButton
            label="Crear"
            icon="i-heroicons-plus-circle" />
        </template>
      </UDashboardNavbar>
      <Basic />
    </UDashboardPanel>
  </div>
</template>