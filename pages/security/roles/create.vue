<script setup lang="ts">
import type { SystemRolesBasic } from '#build/components';

const { state, resetProfileData } = useSecurityRolesForm();
const toast = useToast();

const tabs = [
  { value: 'basic', label: 'Información', icon: 'i-heroicons-user-circle', defaultOpen: true },
];
const tab = ref<'basic'>('basic');
state.value.isLoading = false;
const systemRolesBasic = ref<InstanceType<typeof SystemRolesBasic>>();
  console.log('systemRolesBasic.value')
  console.log(systemRolesBasic.value)
resetProfileData();

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/security/roles');
};

const save = async () => {
  state.value.isLoading = true;
  let newProfileId = null;
  console.log('systemRolesBasic.value')
  console.log(systemRolesBasic.value)
  const isBasicFormInvalid = await systemRolesBasic.value?.validateForm();
  console.log({isBasicFormInvalid})
  const isLinksInvalid = state.value.profileLinks.length <= 0;

  //Upload Data
  if (!isBasicFormInvalid && !isLinksInvalid) {
    state.value.isLoading = false;
    // return
    // const { data, error } = await useFetch(`/api/users/0`, {
    //   method: 'POST',
    //   body: {
    //     profileData: state.value.profileData,
    //     profileLinks: state.value.profileLinks,
    //   },
    // });
    // if (error.value) {
    //   toast.add({
    //     title: 'Error al guardar',
    //     description: error.value?.message,
    //     icon: 'i-heroicons-exclamation-triangle',
    //     color: 'rose',
    //     timeout: 0,
    //   });
    //   state.value.isLoading = false;
    //   return;
    // }
    // newProfileId = data.value?.id;
  } else {
    toast.add({
      title: 'Datos incompletos',
      description: 'Por favor, complete los campos requeridos',
      icon: 'i-heroicons-no-symbol',
      color: 'rose',
      timeout: 2000,
    });
    state.value.isLoading = false;
    return;
  }

  toast.add({
    title: 'Datos guardados correctamente',
    icon: 'i-heroicons-check-circle',
    color: 'primary',
    timeout: 2000,
  });
  await navigateTo('/security/roles');
  state.value.isLoading = false;
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Crear Perfil">
        <template #right>
          <UButton color="gray" icon="i-heroicons-arrow-left-circle" :disabled="state.isLoading" @click="cancel">
            <span class="hidden sm:block">Regresar</span>
          </UButton>
          <UButton label="Guardar" icon="i-heroicons-check-circle" :disabled="state.isLoading" @click="save" />
        </template>
      </UDashboardNavbar>
      <BTabs v-model="tab" :items="tabs" />
      <UDashboardPanelContent>
        <SystemRolesBasic v-show="tab === 'basic'" ref="systemRolesBasic" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>