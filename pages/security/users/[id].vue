<script setup lang="ts">
import type { Form } from '#ui/types'
import { type type_sys_companies } from '~/types/server/sys_companies';
import { userDataForm, type type_sys_users, type type_userDataForm } from '~/types/server/sys_users';
import type { SystemUsersBasic } from '#build/components';

const { state, resetUserData, validateUserData } = useSecurityUsersForm();
const toast = useToast();
const route = useRoute();

const tabs = [
  { value: 'basic', label: 'Usuario', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { value: 'companies',label: 'Compañías', icon: 'i-heroicons-building-office-2', defaultOpen: false },
];
const tab = ref<'basic'|'companies'>('basic');
const mainForm = ref<Form<type_userDataForm>>();
state.value.isLoading = false;
const systemUsersBasic = ref<InstanceType<typeof SystemUsersBasic>>();
resetUserData();

if (route.params.id) {
  const { data } = await useFetch<type_sys_users[]>(`/api/users/${route.params.id}`);
  state.value.userData = data.value?.[0]!;
  const { data: companiesData } = await useFetch<type_sys_companies[]>(`/api/users/${route.params.id}/companies`);
  state.value.userCompanies = companiesData.value?.map(company => company.id.toString()) ?? [];
  const { data: companyOptionsData } = await useFetch<type_sys_companies[]>('/api/lookups/sys_companies');
  state.value.companyOptions = companyOptionsData.value ?? [];
}

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/security/users');
};

const showInvalidFormData = () => {
  toast.add({
    title: 'Datos incompletos',
    description: 'Por favor, complete los campos requeridos',
    icon: 'i-heroicons-no-symbol',
    color: 'rose',
    timeout: 2000,
  });
  state.value.isLoading = false;
  mainForm.value?.validate();
}

const save = async () => {
  state.value.isLoading = true;
  const isDataValid = await validateUserData();
  
  //Upload Data
  if (isDataValid) {
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
  } else {
    showInvalidFormData();
  }
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
      <BTabs v-model="tab" :items="tabs"/>
      <UDashboardPanelContent>
        <UForm ref="mainForm" :state="state.userData" :schema="userDataForm">
          <SystemUsersBasic v-if="tab === 'basic'" ref="systemUsersBasic" :is-editing="true" />
          <SystemUsersCompanies v-if="tab === 'companies'" />
        </UForm>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>