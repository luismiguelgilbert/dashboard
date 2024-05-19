<script setup lang="ts">
import { tabs } from './components/config';
import { PermissionsList } from '~/types/client/permissionsEnum';
import { companyPayload } from '~/types/server/sys_companies';
import Basic from './components/Basic.vue';
import Users from './components/Users.vue';

const { state, resetState } = useSecurityCompaniesForm();
const { sessionData } = useUserSession();
const route = useRoute();
resetState();

const tab = ref<'basic'|'users'>('basic');
const canSave = hasSessionPermission(PermissionsList.COMPANIES_EDIT, sessionData.value.userMenuData!);

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/security/companies');
};

const { data, pending } = await useLazyFetch(`/api/companies/:${route.params.company}`);
state.value.data.companyData = data.value?.[0]!;
watch(data, (newData) => { if (newData?.length) { state.value.data.companyData = newData[0]; } });

const { data: dataUsers, pending: pendingUsers } = await useLazyFetch(`/api/companies/:${route.params.company}/users`);
state.value.companyUsers = dataUsers.value ?? [];
watch(dataUsers, (newData) => { if (newData?.length) { state.value.companyUsers = newData ?? []; } });

const save = async () => {
  const { start, finish } = useLoadingIndicator();
  try{
    start();
    state.value.isLoading = true;
    state.value.isSaving = true;
    await companyPayload.validate(state.value.data);
    //Update Company
    await $fetch(`/api/companies/:${route.params.company}`, {
      method: 'patch',
      body: state.value.data,
    });
    //Upload Avatar
    if (state.value.avatar) {
      const body = new FormData();
      body.append('file', state.value.avatar);
      await $fetch(`/api/companies/:${route.params.company}/avatar`, {
        method: 'patch',
        body,
      });
    }
    //Notify and Redirect
    useToast().add({
      title: 'Datos guardados correctamente',
      icon: 'i-heroicons-check-circle',
      timeout: 1500,
    });
    await navigateTo('/security/companies');
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
      <UDashboardNavbar title="Editar Organización">
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
              :is-editing="true"
              :saving="state.isSaving"
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