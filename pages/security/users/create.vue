<script setup lang="ts">
const { isLoading, resetUserData } = useSecurityUsersForm();

const tabs = [
  { value: 'basic', label: 'Información', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { value: 'companies',label: 'Compañías', icon: 'i-heroicons-swatch', defaultOpen: false },
  { value: 'avatar',label: 'Avatar', icon: 'i-heroicons-swatch', defaultOpen: false },
];
const tab = ref<'basic'|'companies'|'avatar'>('basic');
isLoading.value = false;
resetUserData();

const cancel = async () => {
  isLoading.value = true;
  await navigateTo('/security/users');
};
const save = async() => {
  isLoading.value = true;
  await navigateTo('/security/users');
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Crear Usuario">
        <template #right>
          <UButton color="gray" icon="i-heroicons-arrow-left-circle" :disabled="isLoading" @click="cancel">
            <span class="hidden sm:block">Regresar</span>
          </UButton>
          <UButton label="Guardar" icon="i-heroicons-check-circle" :disabled="isLoading" @click="save" />
        </template>
      </UDashboardNavbar>
      <BTabs
        v-model="tab"
        :items="tabs"
      />
      <UDashboardPanelContent>
        <SystemUsersBasic v-show="tab === 'basic'" />
        <SystemUsersCompanies v-show="tab === 'companies'" />
        <SystemUsersAvatar v-show="tab === 'avatar'" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>