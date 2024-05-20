<script setup lang="ts">
import Excel from 'exceljs';
import { batchUploadTabs } from './components/config';

import BatchFileData from './components/BatchFileData.vue';
import BatchMapping from './components/BatchMapping.vue';
import BatchErrors from './components/BatchErrors.vue';
import BatchUpload from './components/BatchUpload.vue';

const { state } = useSecurityUsersBatch();

const cancel = async () => {
  state.value.isLoading = true;
  await navigateTo('/security/users');
};

const { open, reset, onChange } = useFileDialog({
  accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  directory: false, // Select directories instead of files if set true
});

onChange(async (files) => {
  if (files && files[0]) {
    try {
      state.value.isLoading = true;
      state.value.isValidated = false;
      //Reset data
      let index = 1;
      state.value.rows = [];
      state.value.mapping = {
        email: null,
        user_name: null,
        user_lastname: null,
        user_sex: null,
        sys_profile_id: null,
        prefered_company_id: null,
      };
      state.value.columns = [];
      state.value.resultsError = [];
      state.value.resultsErrorPage = 1;
      state.value.resultsValid = [];
      state.value.resultsValidPage = 1;
      state.value.uploadResultsValid = [];
      state.value.uploadResultsInvalid = [];
      state.value.tab = 'file';

      //Read XLS file
      const workbook = new Excel.Workbook();
      const arrayBuffer = await files[0].arrayBuffer();
      const wb = await workbook.xlsx.load(arrayBuffer);
      // Take the first sheet and the first row
      const firstWorksheet = wb.getWorksheet(1)!;
      const firstWorksheetFirstRow = firstWorksheet.getRow(1);
      // Generate columns
      firstWorksheetFirstRow.eachCell((cell) => {
        state.value.columns.push({
          index: index++,
          key: cell.text,
          label: cell.text,
          sortable: false,
        });
      });
      // Generate named rows
      firstWorksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        if (row.hasValues){
          const obj: any = {};
          row.eachCell((cell, colNumber) => {
            const key = state.value.columns[colNumber - 1].key;
            obj[key] = cell.text.trim();
          });
          state.value.rows.push(obj);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      state.value.isLoading = false;
      reset();
    }
  }
});
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        title="Cargar Usuarios"
        :badge="state.rows.length">
        <template #right>
          <UButton
            color="gray"
            icon="i-heroicons-arrow-left-circle"
            :disabled="state.isLoading"
            @click="cancel">
            <span class="hidden sm:block">Regresar</span>
          </UButton>
          <UButton
            color="primary"
            icon="i-heroicons-folder-open"
            label="Buscar archivo"
            :disabled="state.isLoading"
            @click="open" />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="p-0">
        <BTabs
          v-model="state.tab"
          :items="batchUploadTabs">
          <template #file>
            <BatchFileData />
          </template>
          <template #mapping>
            <BatchMapping />
          </template>
          <template #errors>
            <BatchErrors />
          </template>
          <template #valid>
            <BatchUpload />
          </template>
        </BTabs>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>