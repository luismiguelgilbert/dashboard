<script setup lang="ts">
import { ValidationError } from 'yup';
import { sys_companies, type type_sys_companies_created } from '@/types/server/security/sys_companies';
import { tabs } from './components/config';
import Basic from './components/basicForm.vue';

const { state: dataList } = useSecurityCompanies();
const { state } = useSecurityCompaniesForm();

const tab = ref('basic');
const isRightPanelOpen = ref(true);
const validationErrors = ref<ValidationError>();
const saved = ref(false);

state.value.data = sys_companies.cast({
  id: '',
  company_number: '',
  name_es: '',
  name_es_short: '',
  billing_phone: '',
  billing_address: '',
  is_active: true,
  avatar_url: '',
});

const cancel = async () => {
  dataList.value.selectedId = null;
  await navigateTo('/security/companies');
};

const save = async () => {
  const { start, finish } = useLoadingIndicator();
  try {
    state.value.isSaving = true;
    await sys_companies.validate(state.value.data, { abortEarly: false });
    start();
    let response: type_sys_companies_created = { id: '' };
    response = await $fetch('/api/security/companies/create', {
      method: 'post',
      body: state.value.data,
    });
    validationErrors.value = undefined;
    saved.value = true;
    
    dataList.value.selectedId = String(response.id);
    if (state.value.avatar) {
      const body = new FormData();
      body.append('file', state.value.avatar);
      await $fetch(`/api/security/companies/:${String(response.id)}/avatar`, {
        method: 'patch',
        body,
      });
    }
    await navigateTo(`/security/companies/company-${response.id}`);
  } catch (error) {
    if (error instanceof ValidationError) {
      validationErrors.value = error;
    } else {
      validationErrors.value = new ValidationError('Algo salió mal');
    }
  } finally {
    state.value.isLoading = false;
    state.value.isSaving = false;
    finish();
  }
};
</script>

<template>
  <div>
    <UDashboardPanel
      v-model="isRightPanelOpen"
      class="h-[calc(100dvh)]"
      collapsible
      grow
      side="right">
      <UDashboardNavbar
        title="Crear Organización"
        class="sticky top-0 z-10 bg-white dark:bg-gray-900">
        <template #toggle>
          <span />
        </template>
        <template #right>
          <UButton
            label="Cancelar"
            icon="i-heroicons-arrow-left-circle"
            color="gray"
            :disabled="state.isSaving"
            @click="cancel" />
          <UButton
            label="Crear"
            icon="i-heroicons-plus-circle"
            :disabled="state.isSaving"
            @click="save" />
        </template>
      </UDashboardNavbar>
      <div
        v-if="validationErrors?.errors || saved"
        class="p-2">
        <UAlert
          v-if="validationErrors?.errors"
          icon="i-heroicons-exclamation-triangle"
          color="rose"
          variant="soft"
          title="Error">
          <template #description>
            <li
              v-for="(error, index) in validationErrors.errors"
              :key="index">
              {{ error }} <br />
            </li>
          </template>
        </UAlert>
        <UAlert
          v-if="saved"
          icon="i-heroicons-check-circle"
          color="green"
          variant="soft"
          title="Datos guardados" />
      </div>
      <BTabs
        v-model="tab"
        :items="tabs.filter(tab => tab.value !== 'users')"
        class="sticky top-0 z-10 bg-white dark:bg-gray-900">
        <template #basic>
          <Basic />
        </template>
      </BTabs>
    </UDashboardPanel>
  </div>
</template>