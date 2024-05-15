<script setup lang="ts">
import { tabs } from './components/config';
import { PermissionsList } from '~/types/client/permissionsEnum';
import { userPayload } from '@/types/server/sys_users';
import Basic from './components/Basic.vue';
import Companies from './components/Companies.vue';

const { state, resetState } = useSecurityUsersForm();
const { sessionData } = useUserSession();
resetState();

const tab = ref<'basic'|'companies'>('basic');
const canSave = hasSessionPermission(PermissionsList.USERS_CREATE, sessionData.value.userMenuData!);
state.value.isLoading = false;
const systemUsersBasic = ref<InstanceType<typeof Basic>>();

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/security/users');
};

const save = async () => {
  const { start, finish } = useLoadingIndicator();
  try {
    start();
    state.value.isLoading = true;
    state.value.isSaving = true;
    await userPayload.validate(state.value.data);
    const data = await $fetch('/api/users/0', {
      method: 'post',
      body: state.value.data,
    });  
    //Upload Avatar
    if (state.value.avatar && data?.id) {
      const body = new FormData();
      body.append('file', state.value.avatar);
      await $fetch(`/api/users/:${data.id}/avatar`, {
        method: 'PATCH',
        body,
      });
    }
    //Notify and Redirect
    useToast().add({
      title: 'Datos guardados correctamente',
      icon: 'i-heroicons-check-circle',
      timeout: 1500,
    });
    await navigateTo('/security/users');
  } catch(error) {
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
      <UDashboardNavbar title="Crear Usuario">
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
              :is-editing="false"
              :saving="state.isSaving" />
          </template>
          <template #companies>
            <Companies />
          </template>
        </BTabs>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>