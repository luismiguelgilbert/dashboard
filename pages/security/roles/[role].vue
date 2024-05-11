<script setup lang="ts">
import type { Form } from '#ui/types';
import { type type_profileDataForm } from '@/types/server/sys_profiles';
import { type type_userDataForm } from '@/types/server/sys_users';
import { PermissionsList } from '~/types/client/permissionsEnum';
import Basic from './components/Basic.vue';
import Users from './components/Users.vue';

const { state, resetProfileData, validateProfileData } = useSecurityRolesForm();
const { sessionData } = useUserSession();
const toast = useToast();
const route = useRoute();

const tabs = [
  { value: 'basic', slot: 'basic', label: 'Perfil', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { value: 'users', slot: 'users', label: 'Usuarios Asignados', icon: 'i-heroicons-users', defaultOpen: false },
];
const tab = ref<'basic'|'users'>('basic');
const mainForm = ref<Form<type_profileDataForm>>();
const canSave = hasSessionPermission(PermissionsList.ROLES_EDIT, sessionData.value.userMenuData!);
state.value.isLoading = false;
// const systemRolesBasic = ref<InstanceType<typeof Basic>>();
resetProfileData();


  const { data, pending } = await useLazyFetch(`/api/roles/:${route.params.role}`);
  state.value.profileData = data.value?.[0]!;
  watch(data, (newData) => { if (newData?.length) { state.value.profileData = newData[0]; } });

  const { data: dataLinks } = await useLazyFetch(`/api/roles/:${route.params.role}/links`);
  state.value.profileLinks = dataLinks.value?.map(link => link.sys_link_id) ?? [];
  watch(dataLinks, (newData) => { if (newData?.length) { state.value.profileLinks = newData.map(link => link.sys_link_id) ?? [];} });

  const { data: dataUsers, pending: pendingUsers } = await useLazyFetch<type_userDataForm[]>(`/api/roles/${route.params.role}/users`);
  state.value.profileUsers = dataUsers.value ?? [];
  watch(dataUsers, (newData) => { if (newData?.length) { state.value.profileUsers = newData ?? [];} });

  // const { data } = await useFetch<type_profileDataForm[]>(`/api/roles/${route.params.id}`);
  // state.value.profileData = data.value?.[0]!;
  // const { data: profileLinks } = await useFetch<type_profile_sys_links[]>(`/api/roles/${route.params.id}/links`);
  // state.value.profileLinks = profileLinks.value?.map(link => link.sys_link_id) ?? [];
  // const { data: profileUsers } = await useFetch<type_userDataForm[]>(`/api/roles/${route.params.id}/users`);
  // state.value.profileUsers = profileUsers.value ?? [];


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
};

const save = async () => {
  state.value.isLoading = true;
  const isDataValid = await validateProfileData();
  if (isDataValid) {
    const { error } = await useFetch(`/api/roles/:${route.params.id}`, {
      method: 'PATCH',
      body: {
        profileData: state.value.profileData,
        profileLinks: state.value.profileLinks,
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
    }
    toast.add({
      title: 'Datos guardados correctamente',
      icon: 'i-heroicons-check-circle',
      color: 'primary',
      timeout: 2000,
    });
    await navigateTo('/security/roles');
    state.value.isLoading = false;
  } else {
    showInvalidFormData();
  }
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Editar Perfil">
        <template #right>
          <UButton
            color="gray"
            icon="i-heroicons-arrow-left-circle"
            :disabled="state.isLoading"
            @click="cancel">
            <span class="hidden sm:block">Regresar</span>
          </UButton>
          <UButton
            label="Guardar"
            icon="i-heroicons-check-circle"
            :disabled="state.isLoading || !canSave"
            @click="save" />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="p-0">
        <!-- <UForm ref="mainForm" :state="state.profileData" :schema="profileDataForm"> -->
        <BTabs
          v-model="tab"
          :items="tabs">
          <template #basic>
            <Basic
              ref="systemUsersBasic"
              :is-editing="true"
              :loading="pending" />
          </template>
          <template #users>
            <Users :loading="pendingUsers" />
          </template>
        </BTabs>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>