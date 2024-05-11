<script setup lang="ts">
import { PermissionsList } from '~/types/client/permissionsEnum';
import Basic from './components/Basic.vue';
import Companies from './components/Companies.vue';

const { state, resetState, validateData } = useSecurityUsersForm();
const { sessionData } = useUserSession();
const route = useRoute();
console.log({route});
resetState();

const tabs = [
  { value: 'basic', slot: 'basic', label: 'Usuario', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { value: 'companies', slot: 'companies', label: 'Compañías', icon: 'i-heroicons-building-office-2', defaultOpen: false },
];
const tab = ref<'basic'|'companies'>('basic');
const isSaving = ref(false);
const canSave = hasSessionPermission(PermissionsList.USERS_EDIT, sessionData.value.userMenuData!);
state.value.isLoading = false;
const systemUsersBasic = ref<InstanceType<typeof Basic>>();

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/security/users');
};

const { data, pending } = await useLazyFetch(`/api/users/:${route.params.user}`);
state.value.data = data.value?.[0]!;
watch(data, (newData) => { if (newData?.length) { state.value.data = newData[0]; } });

const { data: dataCompanies, pending: pendingCompanies } = await useLazyFetch(`/api/users/:${route.params.user}/companies`);
state.value.userCompanies = dataCompanies.value?.map(company => company.id.toString()) ?? [];
watch(dataCompanies, (newData) => { if (newData?.length) { state.value.userCompanies = newData.map(company => company.id.toString()); } });

const save = async () => {
  isSaving.value = true;
  const isDataValid = await validateData();
  if (isDataValid) {
    // state.value.isLoading = true;
    // state.value.userData.should_validate = true;
    
    // //Upload Data
    // if (isDataValid) {
    //   const { error } = await useFetch(`/api/users/${route.params.id}`, {
    //     method: 'PATCH',
    //     body: {
    //       userData: state.value.userData,
    //       userCompanies: state.value.userCompanies,
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
  }
};

</script>

<template>
  <UDashboardPage
    v-if="route.name === 'security-users-user'"
    class="w-dvw">
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
              :loading="pending"
              :saving="isSaving" />
          </template>
          <template #companies>
            <Companies
              :loading="pendingCompanies"
              :saving="isSaving" />
          </template>
        </BTabs>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
  <NuxtPage v-else />
</template>