<script setup lang="ts">
import type { Form } from '#ui/types'
import { type type_profile_sys_links } from '~/types/server/sys_links';
import { profileDataForm, type type_profileDataForm } from '@/types/server/sys_profiles';
import type { SystemRolesBasic } from '#build/components';

const { state, resetProfileData } = useSecurityRolesForm();
const toast = useToast();
const route = useRoute();

const tabs = [
  { value: 'basic', label: 'Información', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { value: 'users',label: 'Usuarios Asignados', icon: 'i-heroicons-users', defaultOpen: false },
];
const tab = ref<'basic'|'users'>('basic');
const mainForm = ref<Form<type_profileDataForm>>();
state.value.isLoading = false;
const systemRolesBasic = ref<InstanceType<typeof SystemRolesBasic>>();
resetProfileData();

if (route.params.id) {
  const { data } = await useFetch<type_profileDataForm[]>(`/api/roles/${route.params.id}`);
  state.value.profileData = data.value?.[0]!;
  const { data: profileLinks } = await useFetch<type_profile_sys_links[]>(`/api/roles/${route.params.id}/links`);
  state.value.profileLinks = profileLinks.value?.map(link => link.sys_link_id) ?? [];
}

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/security/roles');
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
  // isLoading.value = true;
  // const isBasicFormInvalid = await systemUsersBasic.value?.validateForm();
  // const isCompaniesInvalid = userCompanies.value.length <= 0;
  
  // //Upload Data
  // if (!isBasicFormInvalid && !isCompaniesInvalid) {
  //   const { error } = await useFetch(`/api/users/${route.params.id}`, {
  //     method: 'PATCH',
  //     body: {
  //       userData: userData.value,
  //       userCompanies: userCompanies.value,
  //     },
  //   });
  //   if (error.value) {
  //     toast.add({
  //       title: 'Error al guardar',
  //       description: error.value?.message,
  //       icon: 'i-heroicons-exclamation-triangle',
  //       color: 'rose',
  //       timeout: 0,
  //     });
  //     isLoading.value = false;
  //     return;
  //   }
  // } else {
  //   toast.add({
  //     title: 'Datos incompletos',
  //     description: 'Por favor, complete los campos requeridos',
  //     icon: 'i-heroicons-no-symbol',
  //     color: 'rose',
  //     timeout: 2000,
  //   });
  //   isLoading.value = false;
  //   return;
  // }

  // //Upload Avatar
  // if (avatar.value) {
  //   const body = new FormData();
  //   body.append('file', avatar.value);
  //   const { error: avatarError } = await useFetch(`/api/users/${route.params.id}/avatar`, {
  //     method: 'PATCH',
  //     body,
  //   });
  //   if (avatarError.value) {
  //     toast.add({
  //       title: 'Error al guardar avatar',
  //       description: avatarError.value?.message,
  //       icon: 'i-heroicons-exclamation-triangle',
  //       color: 'rose',
  //       timeout: 0,
  //     });
  //     isLoading.value = false;
  //     return;
  //   }
  // }

  // toast.add({
  //   title: 'Datos guardados correctamente',
  //   icon: 'i-heroicons-check-circle',
  //   color: 'primary',
  //   timeout: 2000,
  // });
  // await navigateTo('/security/users');
  // isLoading.value = false;
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
        <UForm ref="mainForm" :state="state.profileData" :schema="profileDataForm">
          <SystemRolesBasic v-if="tab === 'basic'" ref="systemRolesBasic" :is-editing="true" />
          <SystemRolesUsers v-if="tab === 'users'" />
        </UForm>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>