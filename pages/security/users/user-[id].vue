<script setup lang="ts">
import { ValidationError } from 'yup';
import { sys_users } from '@/types/server/security/sys_users';
import { tabs } from './components/config';
import Basic from './components/basicForm.vue';
import Companies from './components/companiesList.vue';

const route = useRoute();
const { state: dataList } = useSecurityUsers();
const { state } = useSecurityUsersForm();
const { handleUnauthorized } = useUserSession();

state.value.isLoading = true;
const tab = ref('basic');
const isRightPanelOpen = ref(true);
const validationErrors = ref<ValidationError>();
const saved = ref(false);
dataList.value.selectedId = String(route.params?.id);

const cancel = async () => {
  state.value.data = null;
  dataList.value.selectedId = null;
  isRightPanelOpen.value = false;
  await navigateTo('/security/users');
};

const save = async () => {
  const { start, finish } = useLoadingIndicator();
  try {
    await sys_users.validate(state.value.data, { abortEarly: false });
    saved.value = false;
    start();
    state.value.isSaving = true;
    if(state.value.data?.id){
      await $fetch(`/api/security/users/:${state.value.data.id}`, {
        method: 'patch',
        body: state.value.data,
      });

      if (state.value.avatar) {
        const body = new FormData();
        body.append('file', state.value.avatar);
        await $fetch(`/api/security/users/:${state.value.data.id}/avatar`, {
          method: 'patch',
          body,
        });
      }
    }
    validationErrors.value = undefined;
    saved.value = true;
  } catch (error) {
    if (error instanceof ValidationError) {
      validationErrors.value = error;
    } else {
      validationErrors.value = new ValidationError('Algo salió mal');
    }
  } finally {
    state.value.isSaving = false;
    finish();
  }
};

await $fetch(`/api/security/users/:${route.params.id}`)
  .then((res) => { if (res && res[0]) {
      state.value.data = res[0];
      state.value.isLoading = false;
    }})
  .catch((err) => { err.statusCode === 401 && handleUnauthorized(null); });

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
        title="Editar Usuario"
        class="sticky top-0 z-10 bg-white dark:bg-gray-900">
        <template #toggle>
          <span />
        </template>
        <template #right>
          <UButton
            label="Cancelar"
            icon="i-heroicons-arrow-left-circle"
            color="gray"
            :disabled="state.isLoading || state.isSaving"
            @click="cancel" />
          <UButton
            label="Guardar"
            icon="i-heroicons-check-circle"
            :disabled="state.isLoading || state.isSaving"
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
      <div v-if="!state.isLoading">
        <BTabs
          v-model="tab"
          :items="tabs">
          <template #basic>
            <Basic v-if="state.data" />
          </template>
          <template #companies>
            <Companies v-if="state.data" />
          </template>
        </BTabs>
      </div>
      <SkeletonHeader v-if="state.isLoading" />
    </UDashboardPanel>
  </div>
</template>