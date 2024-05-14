<script setup lang="ts">
import { tabs } from './components/config';
import { PermissionsList } from '~/types/client/permissionsEnum';
import Basic from './components/Basic.vue';
import Companies from './components/Companies.vue';

const { state, resetState, validateData } = useSecurityUsersForm();
const { sessionData } = useUserSession();

const tab = ref<'basic'|'companies'>('basic');
const canSave = hasSessionPermission(PermissionsList.USERS_CREATE, sessionData.value.userMenuData!);
state.value.isLoading = false;
const systemUsersBasic = ref<InstanceType<typeof Basic>>();
resetState();

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/security/users');
};

const save = async () => {
  state.value.isSaving = true;
  const validationResult = await validateData();
  if (validationResult.isDataValid) {
  // state.value.isLoading = true;
  // state.value.userData.should_validate = true;
  // let newUserId = null;
  // const isDataValid = await validateUserData();
  // //Upload Data
  // if (isDataValid) {
  //   const { data, error } = await useFetch(`/api/users/0`, {
  //     method: 'POST',
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
  //   newUserId = data.value?.id;
  //   //Upload Avatar
  //   if (state.value.avatar && newUserId) {
  //     const body = new FormData();
  //     body.append('file', state.value.avatar);
  //     const { error: avatarError } = await useFetch(`/api/users/:${newUserId}/avatar`, {
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
    useToast().add({
      title: 'Datos guardados correctamente',
      icon: 'i-heroicons-check-circle',
      timeout: 1500,
    });
    return;
  }
  useToast().add({
    title: 'Datos incompletos',
    description: validationResult.error?.errors.map(m => `${m}<br />`).join(''),
    icon: 'i-heroicons-check-circle',
    color: 'rose',
    timeout: 1250 * (validationResult.error?.errors?.length ?? 1),
  });
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