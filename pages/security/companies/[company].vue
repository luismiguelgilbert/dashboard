<script setup lang="ts">
// import type { Form } from '#ui/types';
// import { type type_companyDataForm, type type_sys_companies } from '~/types/server/sys_companies';
import { PermissionsList } from '~/types/client/permissionsEnum';
import Basic from './components/Basic.vue';
import Users from './components/Users.vue';

const { state } = useSecurityCompaniesForm();
const { sessionData } = useUserSession();
const route = useRoute();

const tabs = [
  { value: 'basic', label: 'Organización', icon: 'i-heroicons-user-group', defaultOpen: true },
  { value: 'users',label: 'Usuarios', icon: 'i-heroicons-users', defaultOpen: false },
];
const tab = ref<'basic'|'users'>('basic');
// const mainForm = ref<Form<type_companyDataForm>>();
const canSave = hasSessionPermission(PermissionsList.COMPANIES_EDIT, sessionData.value.userMenuData!);
state.value.isLoading = false;
// const systemCompaniesBasic = ref<InstanceType<typeof Basic>>();
// resetCompanyData();

const { data, pending } = await useLazyFetch<type_sys_companies[]>(`/api/companies/${route.params.company}`);
state.value.data = data.value?.[0]!;
watch(data, (newData) => { if (newData?.length) { state.value.data = newData[0]; } });

// const { data: dataCompanies, pending: pendingCompanies } = await useLazyFetch<type_userDataForm[]>(`/api/companies/${route.params.company}/users`);
// state.value.userCompanies = dataCompanies.value;
// watch(dataCompanies, (newData) => { if (newData?.length) { state.value.userCompanies = newData.map(company => company.id.toString()) } });


if (route.params.id) {
  // const { data } = await useFetch<type_sys_companies[]>(`/api/companies/${route.params.id}`);
  // state.value.companyData = data.value?.[0]!;
  // const { data: profileUsers } = await useFetch<type_userDataForm[]>(`/api/companies/${route.params.id}/users`);
  // state.value.companyUsers = profileUsers.value ?? [];
}

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/security/companies');
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
// };

const save = async () => {
  state.value.isLoading = true;
  // const isDataValid = await validateCompanyData();
  
  //Upload Data
  // if (isDataValid) {
  //   const { error } = await useFetch(`/api/companies/${route.params.id}`, {
  //     method: 'PATCH',
  //     body: {
  //       companyData: state.value.companyData,
  //       // userCompanies: state.value.userCompanies,
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
  //     const { error: avatarError } = await useFetch(`/api/companies/${route.params.id}/avatar`, {
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
  //   await navigateTo('/security/companies');
  //   state.value.isLoading = false;
  // } else {
  //   showInvalidFormData();
  // }
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
              ref="systemUsersBasic"
              :is-editing="true"
              :loading="pending" />
          </template>
          <template #users>
            <Users />
          </template>
        </BTabs>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>