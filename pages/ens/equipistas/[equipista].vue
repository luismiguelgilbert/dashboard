<script setup lang="ts">
// import type { Form } from '#ui/types'
// import {
//   ens_members_form,
//   ens_members_teams,
//   type type_ens_members_lookup,
//   type type_ens_members_form,
//   type type_ens_members_teams,
// } from '~/types/server/ens_types';
import { PermissionsList } from '~/types/client/permissionsEnum';
import Basic from './components/Basic.vue';
import Teams from './components/Teams.vue';

const { state, resetData, validateData } = useEnsEquipistasForm();
const { sessionData } = useUserSession();

const toast = useToast();
const route = useRoute();

const tabs = [
  { value: 'basic', slot: 'basic', label: 'Equipista', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { value: 'teams', slot: 'teams', label: 'Equipos y Servicios', icon: 'i-heroicons-users', defaultOpen: false },
];
const tab = ref<'basic'|'companies'>('basic');
const canSave = hasSessionPermission(PermissionsList.USERS_EDIT, sessionData.value.userMenuData!);
state.value.isLoading = false;

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/ens/equipistas');
};

const { data, pending } = await useLazyFetch<type_ens_members_form[]>(`/api/ens/equipistas/${route.params.equipista}`);
state.value.data = data.value?.[0]!;
watch(data, (newData) => { if (newData?.length) { state.value.data = newData[0] } });

const { data: dataTeams, pending: pendingTeams } = await useLazyFetch<type_ens_members_teams[]>(`/api/ens/equipistas/${route.params.equipista}/teams`);
state.value.data_teams = dataTeams.value ?? [];
watch(dataTeams, (newData) => { if (newData?.length) { state.value.data_teams = newData } });

const save = async () => {
//   state.value.isLoading = true;
//   const isDataValid = await validateData();
  
  //Upload Data
  // if (isDataValid) {
  //   const { error } = await useFetch(`/api/users/${route.params.id}`, {
  //     method: 'PATCH',
  //     body: {
  //       userData: state.value.data,
  //       userCompanies: state.value.,
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
  //     state.value.isLoading = false;
  //     return;
  //   }
  //   //Upload Avatar
  //   if (state.value.avatar) {
  //     const body = new FormData();
  //     body.append('file', state.value.avatar);
  //     const { error: avatarError } = await useFetch(`/api/users/${route.params.id}/avatar`, {
  //       method: 'PATCH',
  //       body,
  //     });
  //     if (avatarError.value) {
  //       toast.add({
  //         title: 'Error al guardar avatar',
  //         description: avatarError.value?.message,
  //         icon: 'i-heroicons-exclamation-triangle',
  //         color: 'rose',
  //         timeout: 0,
  //       });
  //       state.value.isLoading = false;
  //       return;
  //     }
  //   }

  //   toast.add({
  //     title: 'Datos guardados correctamente',
  //     icon: 'i-heroicons-check-circle',
  //     color: 'primary',
  //     timeout: 2000,
  //   });
  //   await navigateTo('/security/users');
  //   state.value.isLoading = false;
  // } else {
  //   showInvalidFormData();
  // }
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Editar Equipista">
        <template #right>
          <UButton color="gray" icon="i-heroicons-arrow-left-circle" :disabled="state.isLoading" @click="cancel">
            <span class="hidden sm:block">Regresar</span>
          </UButton>
          <UButton label="Guardar" icon="i-heroicons-check-circle" :disabled="state.isLoading || !canSave" @click="save" />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="p-0">
        <!-- <UForm ref="mainForm" :state="state.data" :schema="ens_members_form"> -->
          <BTabs v-model="tab" :items="tabs">
            <template #basic>
              <Basic :loading="pending" />
            </template>
            <template #teams>
              <Teams :loading="pendingTeams"/>
            </template>
          </BTabs>
        <!-- </UForm> -->
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>