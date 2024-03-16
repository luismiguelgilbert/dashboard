<script setup lang="ts">
import type { SystemUsersBasic } from '#build/components';

const { state, resetUserData } = useSecurityUsersForm();
const toast = useToast();

const tabs = [
  { value: 'basic', label: 'Información', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { value: 'companies',label: 'Compañías', icon: 'i-heroicons-building-office-2', defaultOpen: false },
];
const tab = ref<'basic'|'companies'>('basic');
state.value.isLoading = false;
const systemUsersBasic = ref<InstanceType<typeof SystemUsersBasic>>();
resetUserData();

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/security/users');
};

const save = async () => {
  state.value.isLoading = true;
  let newUserId = null;
  const isBasicFormInvalid = await systemUsersBasic.value?.validateForm();
  const isCompaniesInvalid = state.value.userCompanies.length <= 0;

  //Upload Data
  if (!isBasicFormInvalid && !isCompaniesInvalid) {
    const { data, error } = await useFetch(`/api/users/0`, {
      method: 'POST',
      body: {
        userData: state.value.userData,
        userCompanies: state.value.userCompanies,
      },
    });
    if (error.value) {
      toast.add({
        title: 'Error al guardar',
        description: error.value?.message,
        icon: 'i-heroicons-exclamation-triangle',
        color: 'rose',
        timeout: 0,
      });
      state.value.isLoading = false;
      return;
    }
    newUserId = data.value?.id;
  } else {
    toast.add({
      title: 'Datos incompletos',
      description: 'Por favor, complete los campos requeridos',
      icon: 'i-heroicons-no-symbol',
      color: 'rose',
      timeout: 2000,
    });
    state.value.isLoading = false;
    return;
  }

  //Upload Avatar
  if (state.value.avatar && newUserId) {
    const body = new FormData();
    body.append('file', state.value.avatar);
    const { error: avatarError } = await useFetch(`/api/users/${newUserId}/avatar`, {
      method: 'PATCH',
      body,
    });
    if (avatarError.value) {
      toast.add({
        title: 'Error al guardar avatar',
        description: avatarError.value?.message,
        icon: 'i-heroicons-exclamation-triangle',
        color: 'rose',
        timeout: 0,
      });
      state.value.isLoading = false;
      return;
    }
  }

  toast.add({
    title: 'Datos guardados correctamente',
    icon: 'i-heroicons-check-circle',
    color: 'primary',
    timeout: 2000,
  });
  await navigateTo('/security/users');
  state.value.isLoading = false;
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Crear Usuario">
        <template #right>
          <UButton color="gray" icon="i-heroicons-arrow-left-circle" :disabled="state.isLoading" @click="cancel">
            <span class="hidden sm:block">Regresar</span>
          </UButton>
          <UButton label="Guardar" icon="i-heroicons-check-circle" :disabled="state.isLoading" @click="save" />
        </template>
      </UDashboardNavbar>
      <BTabs v-model="tab" :items="tabs" />
      <UDashboardPanelContent>
        <SystemUsersBasic v-show="tab === 'basic'" ref="systemUsersBasic" />
        <SystemUsersCompanies v-show="tab === 'companies'" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>