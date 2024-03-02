<script setup lang="ts">
const tabs = [
  { value: 'basic', label: 'Información', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { value: 'companies',label: 'Compañías', icon: 'i-heroicons-swatch', defaultOpen: false },
  { value: 'avatar',label: 'Avatar', icon: 'i-heroicons-swatch', defaultOpen: false },
];
const tab = ref<'basic'|'companies'|'avatar'>('basic');
const loading = ref(false);

const cancel = async () => {
  loading.value = true;
  await navigateTo('/security/users');
};
const save = async() => {
  loading.value = true;
  await navigateTo('/security/users');
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Editar Usuario">
        <template #right>
          <UButton label="Regresar" color="gray" icon="i-heroicons-arrow-left-circle" :disabled="loading" @click="cancel" />
          <UButton label="Guardar" icon="i-heroicons-check-circle" :disabled="loading" @click="save" />
        </template>
      </UDashboardNavbar>
      <BTabs
        v-model="tab"
        :items="tabs"
      />
      <UDashboardPanelContent>
        <SystemUsersBasic v-if="tab === 'basic'" />
        <SystemUsersCompanies v-if="tab === 'companies'" />
        <SystemUsersAvatar v-if="tab === 'avatar'" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>