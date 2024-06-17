<script setup lang="ts">
import { ValidationError } from 'yup';
import { ens_teams } from '@/types/server/ens/ens_teams';
import { tabs } from './components/config';
import Basic from './components/basic.vue';
import Users from './components/users.vue';

const route = useRoute();
const { state: dataList } = useEnsEquipos();
const { state } = useEnsEquiposForm();

const tab = ref('basic');
const isRightPanelOpen = ref(true);
const validationErrors = ref<ValidationError>();
const saved = ref(false);
dataList.value.selectedId = String(route.params.id);

const { data } = await useLazyFetch(`/api/ens/equipos/:${route.params.id}`);
if (data.value) { state.value.data = data.value[0]; }
watch(data, (newData) => { if (newData?.length) { state.value.data = newData[0]; } });

const save = async () => {
  const { start, finish } = useLoadingIndicator();
  try {
    await ens_teams.validate(state.value.data, { abortEarly: false });
    start();
    state.value.isLoading = true;
    if(state.value.data?.id){
      await $fetch(`/api/ens/equipos/:${state.value.data.id}`, {
        method: 'patch',
        body: state.value.data,
      });
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
    state.value.isLoading = false;
    finish();
  }
};
</script>

<template>
  <div>
    <UDashboardPanel
      v-model="isRightPanelOpen"
      collapsible
      grow
      side="right">
      <UDashboardNavbar
        title="Editar Equipo"
        class="sticky top-0 z-10 bg-white dark:bg-gray-900">
        <template #toggle>
          <UDashboardNavbarToggle icon="i-heroicons-x-mark" />
        </template>
        <template #right>
          <UButton
            label="Guardar"
            icon="i-heroicons-check-circle"
            @click="save" />
        </template>
      </UDashboardNavbar>
      <div class="p-2">
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
        :items="tabs"
        class="sticky top-0 z-10 bg-white dark:bg-gray-900">
        <template #basic>
          <Basic />
        </template>
        <template #users>
          <Users />
        </template>
      </BTabs>
    </UDashboardPanel>
  </div>
</template>