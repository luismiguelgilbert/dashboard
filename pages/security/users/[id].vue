<script setup lang="ts">
import { type type_sys_companies } from '~/types/server/sys_companies';
import { type type_sys_users } from '~/types/server/sys_users';
import type { SystemUsersBasic } from '#build/components';

const { state, resetUserData } = useSecurityUsersForm();
const toast = useToast();

const tabs = [
  { value: 'basic', label: 'Usuario', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { value: 'companies',label: 'Compañías', icon: 'i-heroicons-building-office-2', defaultOpen: false },
];
const tab = ref<'basic'|'companies'>('basic');
state.value.isLoading = false;
const systemUsersBasic = ref<InstanceType<typeof SystemUsersBasic>>();
resetUserData();

const route = useRoute();
if (route.params.id) {
  const { data } = await useFetch<type_sys_users[]>(`/api/users/${route.params.id}`);
  state.value.userData = data.value?.[0]!;
  const { data: companiesData } = await useFetch<type_sys_companies[]>(`/api/users/${route.params.id}/companies`);
  state.value.userCompanies = companiesData.value?.map(company => company.id.toString()) ?? [];
}

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/security/users');
};

const save = async () => {
  state.value.isLoading = true;
  const isBasicFormInvalid = await systemUsersBasic.value?.validateForm();
  const isCompaniesInvalid = state.value.userCompanies.length <= 0;
  
  //Upload Data
  if (!isBasicFormInvalid && !isCompaniesInvalid) {
    const { error } = await useFetch(`/api/users/${route.params.id}`, {
      method: 'PATCH',
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
  if (state.value.avatar) {
    const body = new FormData();
    body.append('file', state.value.avatar);
    const { error: avatarError } = await useFetch(`/api/users/${route.params.id}/avatar`, {
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
      <UDashboardNavbar title="Editar Usuario">
        <template #right>
          <UButton color="gray" icon="i-heroicons-arrow-left-circle" :disabled="state.isLoading" @click="cancel">
            <span class="hidden sm:block">Regresar</span>
          </UButton>
          <UButton label="Guardar" icon="i-heroicons-check-circle" :disabled="state.isLoading" @click="save" />
        </template>
      </UDashboardNavbar>
      <BTabs
        v-model="tab"
        :items="tabs"
      />
      <UDashboardPanelContent>
        <SystemUsersBasic v-show="tab === 'basic'" ref="systemUsersBasic" :is-editing="true" />
        <SystemUsersCompanies v-show="tab === 'companies'" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>