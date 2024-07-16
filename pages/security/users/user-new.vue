<script setup lang="ts">
import { ValidationError } from 'yup';
import { sys_users, type type_sys_users_created } from '@/types/server/security/sys_users';
import { tabs } from './components/config';
import Basic from './components/basic.vue';
import Companies from './components/companies.vue';

const { state: dataList } = useSecurityUsers();
const { state } = useSecurityUsersForm();

const tab = ref('basic');
const isRightPanelOpen = ref(true);
const validationErrors = ref<ValidationError>();
const saved = ref(false);

state.value.data = sys_users.cast({
  id: '',
  user_name: '',
  user_lastname: '',
  email: '',
  user_sex: true,
  avatar_url: '',
  website: '',
  sys_profile_id: -1,
  dark_enabled: false,
  default_color: 'indigo',
  default_dark_color: 'zinc',
  prefered_company_id: undefined,
  sys_companies_users: [],
});

const cancel = async () => {
  dataList.value.selectedId = null;
  await navigateTo('/security/users');
};

const save = async () => {
  const { start, finish } = useLoadingIndicator();
  try {
    state.value.isSaving = true;
    await sys_users.validate(state.value.data, { abortEarly: false });
    start();
    let response: type_sys_users_created = { id: '' };
    response = await $fetch('/api/security/users/new', {
      method: 'post',
      body: state.value.data,
    });
    validationErrors.value = undefined;
    saved.value = true;
    
    dataList.value.selectedId = String(response.id);
    if (state.value.avatar) {
      const body = new FormData();
      body.append('file', state.value.avatar);
      await $fetch(`/api/security/users/:${String(response.id)}/avatar`, {
        method: 'patch',
        body,
      });
    }
    await navigateTo(`/security/users/user-${response.id}`);
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
        title="Crear Usuario"
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
        <template #companies>
          <Companies />
        </template>
      </BTabs>
    </UDashboardPanel>
  </div>
</template>