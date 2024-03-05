<script setup lang="ts">
import type { SystemUsersBasic } from '#build/components';

const { isLoading, resetUserData } = useSecurityUsersForm();

const tabs = [
  { value: 'basic', label: 'Información', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { value: 'companies',label: 'Compañías', icon: 'i-heroicons-building-office-2', defaultOpen: false },
  { value: 'avatar',label: 'Avatar', icon: 'i-heroicons-camera', defaultOpen: false },
];
const tab = ref<'basic'|'companies'|'avatar'>('basic');
isLoading.value = false;
const systemUsersBasic = ref<InstanceType<typeof SystemUsersBasic>>();
resetUserData();

const cancel = async () => {
  isLoading.value = true;
  await navigateTo('/security/users');
};

const save = async () => {
  isLoading.value = true;
  const isBasicFormInvalid = await systemUsersBasic.value?.validateForm();
  if (!isBasicFormInvalid) {
    await navigateTo('/security/users');
    isLoading.value = false;
  } else {
    isLoading.value = false;
  }
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
      <BTabs v-model="tab" :items="tabs" />
      <UDashboardPanelContent>
        <SystemUsersBasic v-show="tab === 'basic'" ref="systemUsersBasic" />
        <SystemUsersCompanies v-show="tab === 'companies'" />
        <SystemUsersAvatar v-show="tab === 'avatar'" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>