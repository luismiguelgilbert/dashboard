<script setup lang="ts">
import { tabs } from './components/config';
import { PermissionsList } from '~/types/client/permissionsEnum';
// import { roleDataForm } from '@/types/server/sys_profiles';
import Basic from './components/Basic.vue';
import Users from './components/Users.vue';

const { state, resetState } = useSecurityRolesForm();
const { sessionData } = useUserSession();
const route = useRoute();
resetState();

const tab = ref<'basic'|'users'>('basic');
const canSave = hasSessionPermission(PermissionsList.ROLES_EDIT, sessionData.value.userMenuData!);

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/security/roles');
};

const { data, pending } = await useLazyFetch(`/api/roles/:${route.params.role}`);
state.value.data.profileData = data.value?.[0]!;
watch(data, (newData) => { if (newData?.length) { state.value.data.profileData = newData[0]; } });

const { data: dataLinks, pending: pendingLinks } = await useLazyFetch(`/api/roles/:${route.params.role}/links`);
state.value.data.profileLinks = dataLinks.value ?? [];
watch(dataLinks, (newData) => { if (newData?.length) { state.value.data.profileLinks = newData ?? [];} });

const { data: dataUsers, pending: pendingUsers } = await useLazyFetch(`/api/roles/:${route.params.role}/users`);
state.value.profileUsers = dataUsers.value ?? [];
watch(dataUsers, (newData) => { if (newData?.length) { state.value.profileUsers = newData ?? [];} });

// const { data } = await useFetch<type_profileDataForm[]>(`/api/roles/${route.params.id}`);
// state.value.profileData = data.value?.[0]!;
// const { data: profileLinks } = await useFetch<type_profile_sys_links[]>(`/api/roles/${route.params.id}/links`);
// state.value.profileLinks = profileLinks.value?.map(link => link.sys_link_id) ?? [];
// const { data: profileUsers } = await useFetch<type_userDataForm[]>(`/api/roles/${route.params.id}/users`);
// state.value.profileUsers = profileUsers.value ?? [];

const save = async () => {
//   state.value.isLoading = true;
//   const isDataValid = await validateProfileData();
//   if (isDataValid) {
//     const { error } = await useFetch(`/api/roles/:${route.params.id}`, {
//       method: 'PATCH',
//       body: {
//         profileData: state.value.profileData,
//         profileLinks: state.value.profileLinks,
//       },
//     });
//     if (error.value) {
//       toast.add({
//         title: 'Error al guardar',
//         description: error.value?.message,
//         icon: 'i-heroicons-exclamation-triangle',
//         color: 'rose',
//         timeout: 0,
//       });
//     }
//     toast.add({
//       title: 'Datos guardados correctamente',
//       icon: 'i-heroicons-check-circle',
//       color: 'primary',
//       timeout: 2000,
//     });
//     await navigateTo('/security/roles');
//     state.value.isLoading = false;
//   } else {
//     showInvalidFormData();
//   }
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
        <BTabs
          v-model="tab"
          :items="tabs">
          <template #basic>
            <Basic
              ref="systemUsersBasic"
              :is-editing="true"
              :loading="pending"
              :loading-links="pendingLinks" />
          </template>
          <template #users>
            <Users :loading="pendingUsers" />
          </template>
        </BTabs>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>