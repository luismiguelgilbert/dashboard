<script setup lang="ts">
import { batchResultColumns, uploadResultTabs } from './config';
import { type type_bulkUsersUpload } from '@/types/server/sys_users';

const { state } = useSecurityUsersBatch();
const isOpen = ref(false);

const totalRows = computed(() => state.value.resultsValid.length);
const computeRows = computed(() => {
  return state.value.resultsValid.slice((state.value.resultsValidPage - 1) * state.value.pageCount, (state.value.resultsValidPage) * state.value.pageCount);
});

const createUsers = async () => {
  try {
    state.value.isLoading = true;
    const payload: type_bulkUsersUpload[] = [];
    state.value.resultsValid.forEach((row) => {
      payload.push({
        email: row.email,
        user_name: row.user_name,
        user_lastname: row.user_lastname,
        user_sex: row.user_sex,
        sys_profile_id: state.value.mapping.sys_profile_id!,
        prefered_company_id: state.value.mapping.prefered_company_id!,
      });
    });
    //Create Users
    const result = await $fetch('/api/users/bulk-create', {
      method: 'post',
      body: payload,
    });
    state.value.uploadResultsValid = result.validUsers;
    state.value.uploadResultsInvalid = result.invalidUsers;
    useToast().add({
      title: 'Carga de Usuarios finalizada',
      icon: 'i-heroicons-check-circle',
      timeout: 1500,
    });
  } catch (error) {
    console.error(error);
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
    isOpen.value = true;
  }
};
</script>

<template>
  <div>
    <UDashboardPanelContent class="p-0">
      <UTable
        :rows="computeRows"
        :columns="batchResultColumns.filter(x => x.key !== 'errors')"
        :ui="{ 
          th: { base: 'sticky top-0 z-10 bg-white dark:bg-gray-900' },
          divide: 'divide-gray-200 dark:divide-gray-800',
        }"
        sort-mode="manual"
        class="w-full h-[calc(100dvh-165px)]">
        <template #user_sex-data="{ row }">
          <font-awesome-icon
            v-if="row.user_sex"
            icon="fa-solid fa-person"
            class="text-emerald-500" />
          <font-awesome-icon
            v-if="!row.user_sex"
            icon="fa-solid fa-person-dress"
            class="text-rose-300" />
        </template>
      </UTable>
      <UDivider />
      <div class="flex ...">
        <div class="flex-none w-64 content-center pl-5">
          <UButton
            v-if="totalRows"
            color="primary"
            icon="i-heroicons-plus-circle"
            :label="`Crear ${totalRows} usuarios`"
            :disabled="state.isLoading"
            @click="createUsers" />
        </div>
        <div class="grow" />
        <div class="flex-none w-14">
          <UPagination
            v-model="state.resultsValidPage"
            :page-count="state.pageCount"
            :total="totalRows"
            class="place-content-end p-2" />
        </div>
      </div>
    </UDashboardPanelContent>
  
    <UModal
      v-model="isOpen"
      prevent-close>
      <UCard :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' }, divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Resultados
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpen = false" />
          </div>
        </template>
  
        <BTabs
          v-model="state.uploadResultsTab"
          :items="uploadResultTabs">
          <template #error>
            <UTable
              :rows="state.uploadResultsValid"
              :columns="batchResultColumns.filter(x => x.key !== 'errors')">
              <template #user_sex-data="{ row }">
                <font-awesome-icon
                  v-if="row.user_sex"
                  icon="fa-solid fa-person"
                  class="text-emerald-500" />
                <font-awesome-icon
                  v-if="!row.user_sex"
                  icon="fa-solid fa-person-dress"
                  class="text-rose-300" />
              </template>
            </UTable>
          </template>
          <template #valid>
            <UTable
              :rows="state.uploadResultsInvalid"
              :columns="batchResultColumns.filter(x => x.key !== 'errors')">
              <template #user_sex-data="{ row }">
                <font-awesome-icon
                  v-if="row.user_sex"
                  icon="fa-solid fa-person"
                  class="text-emerald-500" />
                <font-awesome-icon
                  v-if="!row.user_sex"
                  icon="fa-solid fa-person-dress"
                  class="text-rose-300" />
              </template>
            </UTable>
          </template>
        </BTabs>
      </UCard>
    </UModal>
  </div>
</template>