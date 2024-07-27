<script setup lang="ts">
import { ValidationError } from 'yup';
import { ens_libros, type type_ens_libros_created } from '@/types/server/ens/ens_libros';
import { tabs } from './components/config';
import Basic from './components/Basic.vue';

const { state: dataList } = useEnsLibros();
const { state } = useEnsLibrosForm();

const tab = ref('basic');
const isRightPanelOpen = ref(true);
const validationErrors = ref<ValidationError>();
const saved = ref(false);

state.value.data = ens_libros.cast({
  id: '',
  is_active: true,
  name_es: '',
});

const cancel = async () => {
  dataList.value.selectedId = null;
  await navigateTo('/ens/servicios');
};

const save = async () => {
  const { start, finish } = useLoadingIndicator();
  try {
    await ens_libros.validate(state.value.data, { abortEarly: false });
    start();
    state.value.isLoading = true;
    let response: type_ens_libros_created = { id: '' };
    response = await $fetch('/api/ens/libros/create', {
      method: 'post',
      body: state.value.data,
    });
    validationErrors.value = undefined;
    saved.value = true;
    
    dataList.value.selectedId = String(response.id);
    await navigateTo(`/ens/libros/libro-${response.id}`);
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
        title="Crear Libro"
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