<script setup lang="ts">
import { tabs } from './components/config';
import { PermissionsList } from '~/types/client/permissionsEnum';
import { rolePayload } from '@/types/server/sys_profiles';
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

const save = async () => {
  const { start, finish } = useLoadingIndicator();
  try {
    start();
    state.value.isLoading = true;
    state.value.isSaving = true;
    await rolePayload.validate(state.value.data);
    //Update Role
    await $fetch(`/api/roles/:${route.params.role}`, {
      method: 'patch',
      body: state.value.data,
    });
    //Notify and Redirect
    useToast().add({
      title: 'Datos guardados correctamente',
      icon: 'i-heroicons-check-circle',
      timeout: 1500,
    });
    await navigateTo('/security/roles');
  } catch (error) {
    let errorMessage = 'Error desconocido';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    useToast().add({
      title: 'Error',
      description: errorMessage,
      icon: 'i-heroicons-exclamation-triangle',
      color: 'rose',
      timeout: 5000,
    });
  } finally {
    state.value.isSaving = false;
    state.value.isLoading = false;
    finish();
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
        <BTabs
          v-model="tab"
          :items="tabs">
          <template #basic>
            <Basic
              ref="systemUsersBasic"
              :is-editing="true"
              :saving="state.isSaving"
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