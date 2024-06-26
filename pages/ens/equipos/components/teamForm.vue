<script setup lang="ts">
import { tabs } from './config';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { ens_teams } from '~/types/server/ens/ens_teams';

const emits = defineEmits(['data-saved']);

const { state } = useEnsEquipos();
const isMobile = useBreakpoints(breakpointsTailwind).smaller('sm');
const inputSize = computed(() => isMobile.value ? 'lg' : 'xl');
const inputUI = { icon: { leading: { wrapper: 'content-start items-start pt-2.5' }, base: 'text-gray-400' } };
const tab = ref('basic');
const form = ref();

const save = async () => {
  const { start, finish } = useLoadingIndicator();
  try {
    await form.value.validate();
    start();
    state.value.isLoading = true;
    await ens_teams.validate(state.value.selectedTeam);
    //Update Team
    if(state.value.selectedTeam?.id){
      await $fetch(`/api/ens/equipos/:${state.value.selectedTeam.id}`, {
        method: 'patch',
        body: state.value.selectedTeam,
      });
      //Notify and Emit
      useToast().add({
        title: 'Datos guardados correctamente',
        icon: 'i-heroicons-check-circle',
        timeout: 1500,
      });
      emits('data-saved', state.value.selectedTeam);
    }
  } catch (error) {
    let errorMessage = 'Error desconocido';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    useToast().add({
      title: 'Error',
      description: errorMessage,
      icon: 'i-heroicons-exclamation-triangle',
      color: 'rose',
      timeout: 5000,
    });

  } finally {
    state.value.isLoading = false;
    finish();
  }
};
</script>

<template>
  <div>
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
    <BTabs
      v-model="tab"
      :items="tabs"
      class="sticky top-0 z-10 bg-white dark:bg-gray-900">
      <template #basic>
        <UForm
          v-if="state.selectedTeam"
          ref="form"
          class="pl-6 pr-6 md:pl-2 md:pr-2 pt-4 md:pt-0"
          :schema="ens_teams"
          :state="state.selectedTeam">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-2 sm:px-4 content-start">
            <div class="col-span-1 sm:col-span-2 pt-1" />
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                Nombre del Equipo:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Usar Número y Ciudad para identificar equipo.
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="name_es">
              <UInput
                v-model:model-value="state.selectedTeam.name_es"
                required
                placeholder="Nombre del equipo"
                icon="i-heroicons-identification"
                :ui="inputUI"
                :loading="state.isLoading" />
            </UFormGroup>

            <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                Estado:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Estado del perfil.
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="is_active">
              <UToggle
                v-model="state.selectedTeam.is_active"
                :disabled="state.isLoading" />
              <span
                class="ml-5"
                style="vertical-align: text-bottom;">{{ state.selectedTeam.is_active ? 'Activo' : 'Inactivo' }}</span>
            </UFormGroup>
            
            <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                Ciudad:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Ciudad a la que pertenece el equipo
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="nivel_0">
              <UInput
                v-model:model-value="state.selectedTeam.nivel_0"
                required
                placeholder="Ciudad a la que pertenece el equipo"
                icon="i-heroicons-map"
                :ui="inputUI"
                :loading="state.isLoading" />
            </UFormGroup>

            <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                Sector:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Sector a la que pertenece el equipo
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="nivel_1">
              <UInput
                v-model:model-value="state.selectedTeam.nivel_1"
                required
                placeholder="Sector a la que pertenece el equipo"
                icon="i-heroicons-map-pin"
                :ui="inputUI"
                :loading="state.isLoading" />
            </UFormGroup>

            <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                Provincia:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Provincia a la que pertenece el equipo
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="nivel_2">
              <UInput
                v-model:model-value="state.selectedTeam.nivel_2"
                required
                placeholder="Provincia a la que pertenece el equipo"
                icon="i-heroicons-globe-americas"
                :ui="inputUI"
                :loading="state.isLoading" />
            </UFormGroup>

            <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                Región:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Región a la que pertenece el equipo
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="nivel_3">
              <UInput
                v-model:model-value="state.selectedTeam.nivel_3"
                required
                placeholder="Región a la que pertenece el equipo"
                icon="i-heroicons-globe-asia-australia"
                :ui="inputUI"
                :loading="state.isLoading" />
            </UFormGroup>

            <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                País:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                País a la que pertenece el equipo
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="nivel_4">
              <UInput
                v-model:model-value="state.selectedTeam.nivel_4"
                required
                placeholder="País a la que pertenece el equipo"
                icon="i-heroicons-globe-europe-africa"
                :ui="inputUI"
                :loading="state.isLoading" />
            </UFormGroup>

            <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                Super Región:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Super Región a la que pertenece el equipo
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="nivel_5">
              <UInput
                v-model:model-value="state.selectedTeam.nivel_5"
                required
                placeholder="Super Región a la que pertenece el equipo"
                icon="i-heroicons-globe-alt"
                :ui="inputUI"
                :loading="state.isLoading" />
            </UFormGroup>
            
            <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                Zona:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Zona a la que pertenece el equipo
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="nivel_6">
              <UInput
                v-model:model-value="state.selectedTeam.nivel_6"
                required
                placeholder="Zona a la que pertenece el equipo"
                icon="i-heroicons-globe-alt"
                :ui="inputUI"
                :loading="state.isLoading" />
            </UFormGroup>

            <br /><br />
          </div>
        </UForm>
      </template>
    </BTabs>
  </div>
</template>