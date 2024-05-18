<script setup lang="ts">
import { tabs } from './components/config';
import { PermissionsList } from '~/types/client/permissionsEnum';
import { rolePayload } from '@/types/server/sys_profiles';
import Basic from './components/Basic.vue';
import Users from './components/Users.vue';

const { state, resetState } = useSecurityRolesForm();
const { sessionData } = useUserSession();
resetState();

const tab = ref<'basic'|'users'>('basic');
const canSave = hasSessionPermission(PermissionsList.ROLES_CREATE, sessionData.value.userMenuData!);

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/security/roles');
};

const save = async () => {
  const { start, finish } = useLoadingIndicator();
  try {
    start();
    state.value.isLoading = true;
    state.value.isSaving = true;
    await rolePayload.validate(state.value.data);
    //Create Role
    await $fetch('/api/roles/:0', {
      method: 'post',
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
      <UDashboardNavbar title="Crear Perfil">
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
              :saving="state.isSaving" />
          </template>
          <template #users>
            <Users />
          </template>
        </BTabs>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>