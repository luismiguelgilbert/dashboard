<script setup lang="ts">
import { ValidationError } from 'yup';
import { sys_users } from '@/types/server/security/sys_users';
import { tabs } from './components/config';
import Basic from './components/basicForm.vue';
import Companies from './components/companiesList.vue';

const route = useRoute();
const { state: dataList } = useSecurityUsers();
const { state } = useSecurityUsersForm();

const tab = ref('basic');
const isRightPanelOpen = ref(true);
const validationErrors = ref<ValidationError>();
const saved = ref(false);
dataList.value.selectedId = String(route.params.id);

state.value.data = null;
const { data, pending } = await useLazyFetch(`/api/security/users/:${route.params.id}`);
if (data.value) { state.value.data = data.value[0]; }
watch(data, (newData) => { if (newData?.length) { state.value.data = newData[0]; } });

const cancel = async () => {
  dataList.value.selectedId = null;
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
            :disabled="pending || state.isSaving"
            @click="cancel" />
          <UButton
            label="Guardar"
            icon="i-heroicons-check-circle"
            :disabled="pending || state.isSaving"
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
      <UProgress
        v-if="pending"
        animation="carousel" />
      <BTabs
        v-if="!pending"
        v-model="tab"
        :items="tabs">
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