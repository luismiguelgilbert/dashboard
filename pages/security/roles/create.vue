<script setup lang="ts">
import type { Form } from '#ui/types'
import type { SystemRolesBasic } from '#build/components';
import { profileDataForm, type type_profileDataForm } from '@/types/server/sys_profiles';

const { state, resetProfileData, validateProfileData } = useSecurityRolesForm();
const toast = useToast();

const tabs = [
  { value: 'basic', label: 'Información', icon: 'i-heroicons-user-circle', defaultOpen: true },
];
const tab = ref<'basic'|'users'>('basic');
const mainForm = ref<Form<type_profileDataForm>>();
state.value.isLoading = false;
const systemRolesBasicForm = ref<InstanceType<typeof SystemRolesBasic>>();
resetProfileData();

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/security/roles');
};

const showInvalidFormData = () => {
  toast.add({
    title: 'Datos incompletos',
    description: 'Por favor, complete los campos requeridos',
    icon: 'i-heroicons-no-symbol',
    color: 'rose',
    timeout: 2000,
  });
  state.value.isLoading = false;
  mainForm.value?.validate();
}

const save = async () => {
  state.value.isLoading = true;
  const isDataValid = await validateProfileData();
  if (isDataValid) {
    const { data, error } = await useFetch(`/api/roles/0`, {
      method: 'POST',
      body: {
        profileData: state.value.profileData,
        profileLinks: state.value.profileLinks,
      },
    });
    
    if (error.value) {
      toast.add({
        title: 'Error al guardar',
        description: error.value?.message,
        icon: 'i-heroicons-exclamation-triangle',
        color: 'rose',
        timeout: 0,
      });
    }

    toast.add({
      title: 'Datos guardados correctamente',
      icon: 'i-heroicons-check-circle',
      color: 'primary',
      timeout: 2000,
    });
    await navigateTo('/security/roles');
    state.value.isLoading = false;
  } else {
    showInvalidFormData();
  }
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
          <UButton label="Guardar" icon="i-heroicons-check-circle" :disabled="state.isLoading" @click="save"/>
        </template>
      </UDashboardNavbar>
      <BTabs v-model="tab" :items="tabs" />
      <UDashboardPanelContent>
        <UForm ref="mainForm" :state="state.profileData" :schema="profileDataForm">
          <SystemRolesBasic v-show="tab === 'basic'" ref="systemRolesBasicForm" />
        </UForm>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>