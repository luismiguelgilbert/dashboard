<script setup lang="ts">
import type { Form } from '#ui/types'
import type { SystemCompaniesBasic } from '#build/components';
import { companyDataForm, type type_sys_companies } from '~/types/server/sys_companies';

const { state, resetCompanyData, validateCompanyData } = useSecurityCompaniesForm();
const toast = useToast();

const tabs = [
  { value: 'basic', label: 'Organización', icon: 'i-heroicons-user-group', defaultOpen: true },
];
const tab = ref<'basic'|'companies'>('basic');
const mainForm = ref<Form<type_sys_companies>>();
state.value.isLoading = false;
const systemCompaniesBasic = ref<InstanceType<typeof SystemCompaniesBasic>>();
resetCompanyData();

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/security/companies');
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
};

const save = async () => {
  state.value.isLoading = true;
  let newId = null;
  const isDataValid = await validateCompanyData();
  //Upload Data
  if (isDataValid) {
    const { data, error } = await useFetch(`/api/companies/0`, {
      method: 'POST',
      body: {
        companyData: state.value.companyData,
        // userCompanies: state.value.userCompanies,
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
      state.value.isLoading = false;
      return;
    }
    newId = data.value?.id;
    //Upload Avatar
    if (state.value.avatar && newId) {
      const body = new FormData();
      body.append('file', state.value.avatar);
      const { error: avatarError } = await useFetch(`/api/companies/${newId}/avatar`, {
        method: 'PATCH',
        body,
      });
      if (avatarError.value) {
        toast.add({
          title: 'Error al guardar avatar',
          description: avatarError.value?.message,
          icon: 'i-heroicons-exclamation-triangle',
          color: 'rose',
          timeout: 0,
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
      await navigateTo('/security/companies');
      state.value.isLoading = false;
    }
  } else {
    showInvalidFormData();
  }
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Crear Organización">
        <template #right>
          <UButton color="gray" icon="i-heroicons-arrow-left-circle" :disabled="state.isLoading" @click="cancel">
            <span class="hidden sm:block">Regresar</span>
          </UButton>
          <UButton label="Guardar" icon="i-heroicons-check-circle" :disabled="state.isLoading" @click="save" />
        </template>
      </UDashboardNavbar>
      <BTabs v-model="tab" :items="tabs" />
      <UDashboardPanelContent>
        <UForm ref="mainForm" :state="state.companyData" :schema="companyDataForm">
          <SystemCompaniesBasic v-if="tab === 'basic'" ref="systemCompaniesBasic" :is-editing="false" />
          <!-- <SystemUsersCompanies v-if="tab === 'companies'" /> -->
        </UForm>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>