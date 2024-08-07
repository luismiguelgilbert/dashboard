<script setup lang="ts">
import { ValidationError } from 'yup';
import { ens_members, type type_ens_members } from '@/types/server/ens/ens_members';
import { tabs } from './components/config';
import Basic from './components/basicForm.vue';

const { state: dataList } = useEnsEquipistas();
const { state } = useEnsEquipistasForm();

const tab = ref('basic');
const isRightPanelOpen = ref(true);
const validationErrors = ref<ValidationError>();
const saved = ref(false);

state.value.data = ens_members.cast({
  id: '',
  is_active: true,
  user_name: '',
  user_lastname: '',
  email: '',
});

const cancel = async () => {
  dataList.value.selectedId = null;
  await navigateTo('/ens/equipistas');
};

const save = async () => {
  const { start, finish } = useLoadingIndicator();
  try {
    await ens_members.validate(state.value.data, { abortEarly: false });
    start();
    state.value.isLoading = true;
    let response: type_ens_members = { id: '', user_name: '', user_lastname: '', email: '', row_count: null };
    response = await $fetch('/api/ens/equipistas/create', {
      method: 'post',
      body: state.value.data,
    });
    validationErrors.value = undefined;
    saved.value = true;
    
    dataList.value.selectedId = String(response.id);
    await navigateTo(`/ens/equipistas/equipista-${response.id}`);
  } catch (error) {
    if (error instanceof ValidationError) {
      validationErrors.value = error;
    } else {
      validationErrors.value = new ValidationError('Algo salió mal');
    }
  } finally {
    state.value.isLoading = false;
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
        title="Crear Equipista"
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