<script setup lang="ts">
import Excel from 'exceljs';
import { type type_sys_profiles } from '@/types/server/sys_profiles';
import { type type_sys_companies } from '@/types/server/sys_companies';

//REF PROPS
type column = {
  index: number,
  key: string,
  label: string,
  sortable: boolean
}
const rows = ref<any[]>([]);
const columns = ref<column[]>([]);
const pageCount = 50;
const page = ref(1);
const errorPage = ref(1);
const tab = ref('file');
const isLoading = ref(false);
const hasErrors = ref(false);
const errors = ref<any[]>([]);
const accordionKey = ref(1);
const profileOptions = ref<type_sys_profiles[]>([]);
const companyOptions = ref<type_sys_companies[]>([]);
const mapping = ref({
  email: null,
  user_name: null,
  user_lastname: null,
  user_sex: null,
  sys_profile_id: null,
  prefered_company_id: null,
});

//COMPUTED PROPS
const tabs = computed(() =>
  [
    { slot: 'file', value: 'file', label: '1. Cargar archivo', icon: 'i-heroicons-document-arrow-up', defaultOpen: tab.value === 'file'},
    { slot: 'table', value: 'table', label: '2. Ver datos', icon: 'i-heroicons-table-cells', defaultOpen: tab.value === 'table' },
    { slot: 'mapping',value: 'mapping', label: '3. Definiciones', icon: 'i-heroicons-adjustments-horizontal', defaultOpen: tab.value === 'mapping' },
    { slot: 'validate',value: 'validate', label: '4. Validar y crear', icon: 'i-heroicons-document-check', defaultOpen: tab.value === 'validate' },
  ]
);
const totalRows = computed(() => rows.value.length);
const profileOptionsFormatted = computed(() => profileOptions.value.map(p => ({ ...p, disabled: p.is_active })));
const computeRows = computed(() => {
  return rows.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
});
const computeErrorRows = computed(() => {
  return errors.value.slice((errorPage.value - 1) * pageCount, (errorPage.value) * pageCount)
});
const totalErrorRows = computed(() => errors.value.length);
const isValidateDisabled = computed(() => isLoading.value || rows.value.length === 0 || !mapping.value.email || !mapping.value.user_name || !mapping.value.user_lastname || !mapping.value.user_sex || !mapping.value.sys_profile_id || !mapping.value.prefered_company_id);
const errorColumns = computed(() => {
  return [
    ...columns.value,
    { index: columns.value.length + 1, key: 'errors', label: 'Error(es)', sortable: false },
  ];
});
  
//ACTIONS
const { data: profileOptionsData } = await useFetch<type_sys_profiles[]>('/api/lookups/sys_profiles');
const { data: companyOptionsData } = await useFetch<type_sys_companies[]>('/api/lookups/sys_companies');
profileOptions.value = profileOptionsData.value ?? [];
companyOptions.value = companyOptionsData.value ?? [];


const cancel = async () => {
  isLoading.value = true;
  await navigateTo('/security/users');
};

const mappingPreview = (field: string | null) => {
  if (field) {
    const firstRow = rows.value[0];
    return firstRow[field];
  }
};

const { files, open, reset, onChange } = useFileDialog({
  accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  directory: false, // Select directories instead of files if set true
});

onChange(async (files) => {
  if (files && files[0]) {
    try {
      isLoading.value = true;
      //Reset data
      let index = 1;
      rows.value = [];
      mapping.value = {
        email: null,
        user_name: null,
        user_lastname: null,
        user_sex: null,
        sys_profile_id: null,
        prefered_company_id: null,
      };
      columns.value = [];
      hasErrors.value = false;
      errors.value = [];

      //Read XLS file
      const workbook = new Excel.Workbook();
      const arrayBuffer = await files[0].arrayBuffer();
      const wb = await workbook.xlsx.load(arrayBuffer);
      // Take the first sheet and the first row
      const firstWorksheet = wb.getWorksheet(1)!;
      const firstWorksheetFirstRow = firstWorksheet.getRow(1);
      // Generate columns
      firstWorksheetFirstRow.eachCell((cell) => {
        columns.value.push({
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
          let obj: any = {};
          row.eachCell((cell, colNumber) => {
            const key = columns.value[colNumber - 1].key;
            obj[key] = cell.value;
          });
          rows.value.push(obj);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
      reset();
      tab.value = 'table';
      accordionKey.value += 1;
    }
  }
});

const validateData = async () => {
  isLoading.value = true;
  const { error, data } = await useFetch(`/api/users/bulk-create-validate`, {
    method: 'POST',
    body: {
      mapping: mapping.value,
      users: rows.value,
    },
  });
  if (error || data.value?.length) {
    hasErrors.value = true;
    errors.value = data.value ?? [];
    isLoading.value = false;
    return;
  }
  isLoading.value = false;
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Cargar Usuarios" :badge="rows.length">
        <template #right>
          <UButton color="gray" icon="i-heroicons-arrow-left-circle" :loading="isLoading" :disabled="isLoading" @click="cancel">
            <span class="hidden sm:block">Regresar</span>
          </UButton>
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="p-0">
        <UAccordion
          :key="accordionKey"
          :items="tabs"
          open-icon="i-heroicons-plus"
          close-icon="i-heroicons-minus"
          variant="soft"
          class="my-3 px-3"
          size="xl">
          <template #file>
            <div class="grid place-content-center" style="height: calc(100dvh - 330px);">
              <UButton color="gray" icon="i-heroicons-folder-open" :disabled="isLoading" @click="open">
                <span class="hidden sm:block">Cargar</span>
              </UButton>
            </div>
          </template>
          <template #table>
            <div class="border-2 border-grey-100 dark:border-primary-900 rounded-md mx-5" style="height: calc(100dvh - 330px);">
              <UTable
                :rows="computeRows"
                :columns="columns"
                :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
                style="height: calc(100dvh - 390px);"
                sort-mode="manual"/>
              <UDivider/>
              <UPagination
                v-model="page"
                :page-count="pageCount"
                :total="totalRows"
                class="place-content-end p-2"/>
            </div>
          </template>
          <template #mapping>
            <div class="overflow-y-scroll px-5" style="height: calc(100dvh - 330px);">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-2 sm:px-4">

                <UFormGroup label="Email" required class="px-5">
                  <USelectMenu
                    v-model="mapping.email"
                    searchable
                    searchable-placeholder="Buscar campo..."
                    placeholder="Seleccionar campo email..."
                    size="xl"
                    icon="i-heroicons-envelope"
                    value-attribute="label"
                    option-attribute="label"
                    :options="columns" />
                </UFormGroup>
                <UFormGroup label="Vista previa de Email" required class="px-5">
                  <UInput
                    :value="mappingPreview(mapping.email)"
                    placeholder="Seleccionar campo email..."
                    size="xl"
                    readonly
                    icon="i-heroicons-envelope" />
                </UFormGroup>

                <UDivider class="col-span-1 sm:col-span-2 my-3 sm:my-0 px-5" />
                <UFormGroup label="Nombres" required class="px-5">
                  <USelectMenu
                    v-model="mapping.user_name"
                    searchable
                    searchable-placeholder="Buscar campo..."
                    placeholder="Seleccionar campo de nombres..."
                    size="xl"
                    icon="i-heroicons-user"
                    value-attribute="label"
                    option-attribute="label"
                    :options="columns" />
                </UFormGroup>
                <UFormGroup label="Vista previa de Nombre" required class="px-5">
                  <UInput
                    :value="mappingPreview(mapping.user_name)"
                    placeholder="Seleccionar campo Nombres..."
                    size="xl"
                    readonly
                    icon="i-heroicons-user" />
                </UFormGroup>

                <UDivider class="col-span-1 sm:col-span-2 my-3 sm:my-0 px-5" />
                <UFormGroup label="Apellidos" required class="px-5">
                  <USelectMenu
                    v-model="mapping.user_lastname"
                    searchable
                    searchable-placeholder="Buscar campo..."
                    placeholder="Seleccionar campo de apellidos..."
                    size="xl"
                    icon="i-heroicons-user"
                    value-attribute="label"
                    option-attribute="label"
                    :options="columns" />
                </UFormGroup>
                <UFormGroup label="Vista previa de Apellidos" required class="px-5">
                  <UInput
                    :value="mappingPreview(mapping.user_lastname)"
                    placeholder="Seleccionar campo Apellidos..."
                    size="xl"
                    readonly
                    icon="i-heroicons-user" />
                </UFormGroup>

                <UDivider class="col-span-1 sm:col-span-2 my-3 sm:my-0 px-5" />
                <UFormGroup label="Sexo" required class="px-5">
                  <USelectMenu
                    v-model="mapping.user_sex"
                    searchable
                    searchable-placeholder="Buscar campo..."
                    placeholder="Seleccionar campo de sexo..."
                    size="xl"
                    icon="i-heroicons-user"
                    value-attribute="label"
                    option-attribute="label"
                    :options="columns" />
                </UFormGroup>
                <UFormGroup label="Vista previa de Sexo" required class="px-5">
                  <UInput
                    :value="mappingPreview(mapping.user_sex)"
                    placeholder="Seleccionar campo Sexo..."
                    size="xl"
                    readonly
                    icon="i-heroicons-user" />
                </UFormGroup>
                
                <UDivider class="col-span-1 sm:col-span-2 my-3 sm:my-0 px-5" />
                <UFormGroup label="Perfil" required class="px-5 pb-2 col-span-2">
                  <USelectMenu
                    v-model="mapping.sys_profile_id"
                    searchable
                    searchable-placeholder="Buscar campo..."
                    placeholder="Seleccionar rol..."
                    size="xl"
                    icon="i-heroicons-user-circle"
                    value-attribute="id"
                    option-attribute="name_es"
                    :options="profileOptionsFormatted" />
                </UFormGroup>
                <UFormGroup label="Organización" required class="px-5 pb-2 col-span-2">
                  <USelectMenu
                    v-model="mapping.prefered_company_id"
                    searchable
                    searchable-placeholder="Buscar campo..."
                    placeholder="Seleccionar organización..."
                    size="xl"
                    icon="i-heroicons-building-office-2"
                    value-attribute="id"
                    option-attribute="name_es_short"
                    :options="companyOptions" />
                </UFormGroup>
              </div>
            </div>
          </template>
          <template #validate>
            <div v-if="!hasErrors" class="grid place-content-center" style="height: calc(100dvh - 450px);">
              <UButton  color="gray" icon="i-heroicons-shield-check" :disabled="isValidateDisabled" :loading="isLoading" @click="validateData">
                <span class="hidden sm:block">Validar</span>
              </UButton>
            </div>
            <div v-if="hasErrors" class="border-2 border-grey-100 dark:border-primary-900 rounded-md mx-5" style="height: calc(100dvh - 330px);">
              <UTable
                :rows="computeErrorRows"
                :columns="errorColumns"
                :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
                style="height: calc(100dvh - 390px);"
                sort-mode="manual">
                <template #errors-data="{ row }">
                  <li v-for="error in row.errors">
                    <span class="text-red-500">{{ error.message }}</span>
                  </li>
                </template>
              </UTable>
              <UDivider/>
              <UPagination
                v-model="errorPage"
                :page-count="pageCount"
                :total="totalErrorRows"
                class="place-content-end p-2"/>
            </div>
          </template>
        </UAccordion>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>