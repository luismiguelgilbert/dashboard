<script setup lang="ts">
import { type type_sys_companies } from '~/types/server/sys_companies';
import { type type_sys_users } from '~/types/server/sys_users';
import type { SystemUsersBasic } from '#build/components';

const { isLoading, userData, avatar, userCompanies, resetUserData } = useSecurityUsersForm();
const toast = useToast();


const tabs = [
  { value: 'basic', label: 'Usuario', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { value: 'companies',label: 'Compañías', icon: 'i-heroicons-building-office-2', defaultOpen: false },
  { value: 'avatar',label: 'Avatar', icon: 'i-heroicons-camera', defaultOpen: false },
];
const tab = ref<'basic'|'companies'|'avatar'>('basic');
isLoading.value = false;
const systemUsersBasic = ref<InstanceType<typeof SystemUsersBasic>>();
resetUserData();

const route = useRoute();
if (route.params.id) {
  const { data } = await useFetch<type_sys_users[]>(`/api/users/${route.params.id}`);
  userData.value = data.value?.[0]!;
  const { data: companiesData } = await useFetch<type_sys_companies[]>(`/api/users/${route.params.id}/companies`);
  userCompanies.value = companiesData.value?.map(company => company.id.toString()) ?? [];
}

const cancel = async () => {
  isLoading.value = true;
  await navigateTo('/security/users');
};

const save = async () => {
  isLoading.value = true;
  const isBasicFormInvalid = await systemUsersBasic.value?.validateForm();
  const isCompaniesInvalid = userCompanies.value.length <= 0;
  if (!isBasicFormInvalid && !isCompaniesInvalid) {
    //Upload Data
    const { error } = await useFetch(`/api/users/${route.params.id}`, {
      method: 'PATCH',
      body: {
        userData: userData.value,
        userCompanies: userCompanies.value,
      },
    });
    toast.add({
      title: (error.value ) ? 'Error al guardar' : 'Datos guardados correctamente',
      description: error.value ? error.value?.message: undefined,
      icon: error.value ? 'i-heroicons-exclamation-triangle' : 'i-heroicons-check-circle',
      color: error.value ? 'rose' : 'primary',
      timeout: error.value ? 0 : 2000,
    });
    if (error.value) { isLoading.value = false; return }

    //Upload Avatar
    if (avatar.value) {
      const body = new FormData();
      body.append('file', avatar.value);
      const { error: avatarError } = await useFetch(`/api/users/${route.params.id}/avatar`, {
        method: 'PATCH',
        body,
      });
      toast.add({
        title: (avatarError.value ) ? 'Error al guardar avatar' : 'Avatar guardados correctamente',
        description: avatarError.value ? avatarError.value?.message: undefined,
        icon: avatarError.value ? 'i-heroicons-exclamation-triangle' : 'i-heroicons-check-circle',
        color: avatarError.value ? 'rose' : 'primary',
        timeout: avatarError.value ? 0 : 2000,
      });
      if (error.value) { isLoading.value = false; return }
    }
    await navigateTo('/security/users');
    isLoading.value = false;
  } else {
    toast.add({
      title: 'Datos incompletos',
      description: 'Por favor, complete los campos requeridos',
      icon: 'i-heroicons-no-symbol',
      color: 'rose',
      timeout: 2000,
    });
    isLoading.value = false;
  }
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Editar Usuario">
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
        <SystemUsersBasic v-show="tab === 'basic'" ref="systemUsersBasic" :is-editing="true" />
        <SystemUsersCompanies v-show="tab === 'companies'" />
        <SystemUsersAvatar v-show="tab === 'avatar'" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>