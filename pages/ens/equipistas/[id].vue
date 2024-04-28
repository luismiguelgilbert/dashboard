<script setup lang="ts">
// import type { Form } from '#ui/types'
import {
  ens_members_form,
  ens_members_teams,
  type type_ens_members_lookup,
  type type_ens_members_form,
  type type_ens_members_teams,
} from '~/types/server/ens_types';
import { PermissionsList } from '~/types/client/permissionsEnum';
import EnsEquipistasBasic from '../../../components/ens/equipistas/EnsEquipistasBasic.vue';
import EnsEquipistasTeams from '../../../components/ens/equipistas/EnsEquipistasTeams.vue';

const { state, resetData, validateData } = useEnsEquipistasForm();
const { sessionData } = useUserSession();
const toast = useToast();
const route = useRoute();

const tabs = [
  { value: 'basic', slot: 'basic', label: 'Equipista', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { value: 'teams', slot: 'teams', label: 'Equipos y Servicios', icon: 'i-heroicons-users', defaultOpen: false },
];
const tab = ref<'basic'|'companies'>('basic');
// const mainForm = ref<Form<type_userDataForm>>();
const canSave = hasSessionPermission(PermissionsList.USERS_EDIT, sessionData.value.userMenuData!);
state.value.isLoading = false;
// const ensEquipistasBasic = ref<InstanceType<typeof ensEquipistasBasic>>();
// resetData();

// const { data: companiesData } = await useFetch<type_sys_companies[]>(`/api/users/${route.params.id}/companies`);
// state.value.userCompanies = companiesData.value?.map(company => company.id.toString()) ?? [];

if (route.params.id) {
  const { data } = useFetch<type_ens_members_form[]>(`/api/ens/equipistas/${route.params.id}`);
  state.value.data = data.value?.[0]!;

  const { data: dataTeams } = useFetch<type_ens_members_teams[]>(`/api/ens/equipistas/${route.params.id}/teams`);
  state.value.data_teams = dataTeams.value ?? [];
}

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/ens/equipistas');
};

// const showInvalidFormData = () => {
//   toast.add({
//     title: 'Datos incompletos',
//     description: 'Por favor, complete los campos requeridos',
//     icon: 'i-heroicons-no-symbol',
//     color: 'rose',
//     timeout: 2000,
//   });
//   state.value.isLoading = false;
//   mainForm.value?.validate();
// }

// const save = async () => {
//   state.value.isLoading = true;
//   const isDataValid = await validateUserData();
  
//   //Upload Data
//   if (isDataValid) {
//     const { error } = await useFetch(`/api/users/${route.params.id}`, {
//       method: 'PATCH',
//       body: {
//         userData: state.value.userData,
//         userCompanies: state.value.userCompanies,
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
//       state.value.isLoading = false;
//       return;
//     }
//     //Upload Avatar
//     if (state.value.avatar) {
//       const body = new FormData();
//       body.append('file', state.value.avatar);
//       const { error: avatarError } = await useFetch(`/api/users/${route.params.id}/avatar`, {
//         method: 'PATCH',
//         body,
//       });
//       if (avatarError.value) {
//         toast.add({
//           title: 'Error al guardar avatar',
//           description: avatarError.value?.message,
//           icon: 'i-heroicons-exclamation-triangle',
//           color: 'rose',
//           timeout: 0,
//         });
//         state.value.isLoading = false;
//         return;
//       }
//     }

//     toast.add({
//       title: 'Datos guardados correctamente',
//       icon: 'i-heroicons-check-circle',
//       color: 'primary',
//       timeout: 2000,
//     });
//     await navigateTo('/security/users');
//     state.value.isLoading = false;
//   } else {
//     showInvalidFormData();
//   }
// };
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
      <!-- <BTabs v-model="tab" :items="tabs"/> -->
      <UDashboardPanelContent class="p-0">
        <UForm ref="mainForm" :state="state.data" :schema="ens_members_form">
          <BTabs v-model="tab" :items="tabs">
            <template #basic>
                <EnsEquipistasBasic />
            </template>
            <template #teams>
                <EnsEquipistasTeams />
            </template>
          </BTabs>
        </UForm>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>