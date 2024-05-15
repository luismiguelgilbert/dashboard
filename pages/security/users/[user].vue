<script setup lang="ts">
import { tabs } from './components/config';
import { PermissionsList } from '~/types/client/permissionsEnum';
import { userPayload } from '@/types/server/sys_users';
import Basic from './components/Basic.vue';
import Companies from './components/Companies.vue';

const { state, resetState } = useSecurityUsersForm();
const { sessionData } = useUserSession();
const route = useRoute();
resetState();

const tab = ref<'basic'|'companies'>('basic');
const canSave = hasSessionPermission(PermissionsList.USERS_EDIT, sessionData.value.userMenuData!);
state.value.isLoading = false;
const systemUsersBasic = ref<InstanceType<typeof Basic>>();

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/security/users');
};

const { data, pending } = await useLazyFetch(`/api/users/:${route.params.user}`);
state.value.data.userData = data.value?.[0]!;
watch(data, (newData) => { if (newData?.length) { state.value.data.userData = newData[0]; } });

const { data: dataCompanies, pending: pendingCompanies } = await useLazyFetch(`/api/users/:${route.params.user}/companies`);
state.value.data.userCompanies = dataCompanies.value?.map(company => company.id.toString()) ?? [];
watch(dataCompanies, (newData) => { if (newData?.length) { state.value.data.userCompanies = newData.map(company => company.id.toString()); } });

const save = async () => {
  const { start, finish } = useLoadingIndicator();
  try {
    start();
    state.value.isLoading = true;
    state.value.isSaving = true;
    await userPayload.validate(state.value.data);
    //Update User
    await $fetch(`/api/users/:${route.params.user}`, {
      method: 'patch',
      body: state.value.data,
    });  
    //Upload Avatar
    if (state.value.avatar) {
      const body = new FormData();
      body.append('file', state.value.avatar);
      await $fetch(`/api/users/:${route.params.id}/avatar`, {
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
  <UDashboardPage class="w-dvw">
    <UDashboardPanel grow>
      <UDashboardNavbar title="Editar Usuario">
        <template #right>
          <UButton
            color="gray"
            icon="i-heroicons-arrow-left-circle"
            :disabled="state.isLoading || pending"
            @click="cancel">
            <span class="hidden sm:block">Regresar</span>
          </UButton>
          <UButton
            label="Guardar"
            icon="i-heroicons-check-circle"
            :disabled="state.isLoading || pending || !canSave"
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
              :loading="pending" />
          </template>
          <template #companies>
            <Companies
              :loading="pendingCompanies" />
          </template>
        </BTabs>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>