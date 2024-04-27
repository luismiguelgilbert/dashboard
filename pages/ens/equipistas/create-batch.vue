<script setup lang="ts">
import Excel from 'exceljs';
// import { type type_sys_profiles } from '@/types/server/sys_profiles';
// import { type type_sys_companies } from '@/types/server/sys_companies';

//REF PROPS
// type column = {
//   index: number,
//   key: string,
//   label: string,
//   sortable: boolean
// }
const rows = ref<any[]>([]);
const columns = ref<column[]>([]);
const pageCount = 50;
const page = ref(1);
const errorPage = ref(1);
const validPage = ref(1);
const tab = ref('file');
const isLoading = ref(false);
const isValidated = ref(false);
const errors = ref<any[]>([]);
const accordionKey = ref(1);
// const profileOptions = ref<type_sys_profiles[]>([]);
// const companyOptions = ref<type_sys_companies[]>([]);
const mapping = ref({
  email: null,
  user_name: null,
  user_lastname: null,
  user_sex: null,
  sys_profile_id: null,
  prefered_company_id: null,
});
const validationTab = ref('results');
// const validationTabs = [
//   { value: 'results', slot: 'results', label: 'Resultados', icon: 'i-heroicons-chart-bar', defaultOpen: true },
//   { value: 'error', slot: 'error', label: 'Errores', icon: 'i-heroicons-exclamation-triangle', defaultOpen: false },
//   { value: 'valid', slot: 'valid', label: 'Válidos', icon: 'i-heroicons-check-circle', defaultOpen: false },
// ];

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
// const profileOptionsFormatted = computed(() => profileOptions.value.map(p => ({ ...p, disabled: !p.is_active })));
// const companyOptionsFormatted = computed(() => companyOptions.value.map(p => ({ ...p, disabled: !p.is_active })));

const computeRows = computed(() => {
  return rows.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
});
const computedErrorRows = computed(() => {
  return errors.value.filter(x => x.errors.length > 0).slice((errorPage.value - 1) * pageCount, (errorPage.value) * pageCount)
});
// const totalErrorRows = computed(() => errors.value.filter(x => x.errors.length > 0).length);
// const computedValidRows = computed(() => {
//   return errors.value.filter(x => x.errors.length <= 0).slice((validPage.value - 1) * pageCount, (validPage.value) * pageCount)
// });
// const totalValidRows = computed(() => errors.value.filter(x => x.errors.length <= 0).length);

const isValidateDisabled = computed(() => isLoading.value || rows.value.length === 0 || !mapping.value.email || !mapping.value.user_name || !mapping.value.user_lastname || !mapping.value.user_sex || !mapping.value.sys_profile_id || !mapping.value.prefered_company_id);
// const errorColumns = computed(() => {
//   return [
//     ...columns.value,
//     { index: columns.value.length + 1, key: 'errors', label: 'Error(es)', sortable: false },
//   ];
// });
// const errorStats = computed(() => {
//   const invalidRows = errors.value.filter(x => x.errors?.length > 0);
//   return [
//     { label: 'Total de registros', value: rows.value.length, icon: "i-heroicons-chart-bar" },
//     { label: 'Registros válidos', value: (rows.value.length - invalidRows.length), icon: "i-heroicons-check-circle" },
//     { label: 'Registros con errores', value: invalidRows.length, icon: "i-heroicons-exclamation-triangle" },
//   ];
// });
// //ACTIONS
// const { data: profileOptionsData } = await useFetch<type_sys_profiles[]>('/api/lookups/sys_profiles');
// const { data: companyOptionsData } = await useFetch<type_sys_companies[]>('/api/lookups/sys_companies');
// profileOptions.value = profileOptionsData.value ?? [];
// companyOptions.value = companyOptionsData.value ?? [];

const cancel = async () => {
  isLoading.value = true;
  await navigateTo('/ens/equipistas');
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
      isValidated.value = false;
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
      errors.value = [];
      errorPage.value = 1;
      validationTab.value = "results";

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
            obj[key] = cell.text.trim();
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

// const validateData = async () => {
//   isLoading.value = true;
//   const { error, data } = await useFetch(`/api/users/bulk-create-validate`, {
//     method: 'POST',
//     body: {
//       mapping: mapping.value,
//       users: rows.value,
//     },
//   });
//   isValidated.value = true;
//   isLoading.value = false;
//   if (error || data.value?.length) {
//     errors.value = data.value ?? [];
//   }
// };

// const createUsers = async () => {
//   isLoading.value = true;
//   await useFetch(`/api/users/bulk-create`, {
//     method: 'POST',
//     body: {
//       mapping: mapping.value,
//       users: errors.value.filter(x => x.errors.length <= 0).slice(0, 2),
//     },
//   });
//   isLoading.value = false;
// };
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Cargar Equipistas" :badge="rows.length">
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
              <UCard class="mt-2">
                <template #header>
                  <div class="grid grid-cols-6 gap-1 sm:gap-5 px-2 sm:px-4">
                    <p class="text-gray-900 dark:text-white font-semibold">
                      Dato:
                    </p>
                    <p class="col-span-2 text-gray-900 dark:text-white font-semibold">
                      Columna en el archivo:
                    </p>
                    <p class="col-span-2 text-gray-900 dark:text-white font-semibold">
                      Vista Previa:
                    </p>
                  </div>
                </template>
                <div class="grid grid-cols-6 gap-1 sm:gap-5 px-2 sm:px-4">
                  <p class="text-gray-900 dark:text-white place-content-center">Email equipista</p>
                  <USelectMenu
                    v-model="mapping.email"
                    class="col-span-2"
                    searchable
                    searchable-placeholder="Buscar campo..."
                    placeholder="Seleccionar campo email..."
                    size="xl"
                    icon="i-heroicons-envelope"
                    value-attribute="label"
                    option-attribute="label"
                    :options="columns" />
                  <UInput
                    :value="mappingPreview(mapping.email)"
                    class="col-span-3"
                    variant="none"
                    placeholder="Seleccionar campo email..."
                    size="xl"
                    readonly
                    icon="i-heroicons-envelope" />
                </div>
                <div class="grid grid-cols-6 gap-1 sm:gap-5 px-2 sm:px-4">
                  <p class="text-gray-900 dark:text-white place-content-center">Email de cónyuge</p>
                  <USelectMenu
                    v-model="mapping.email"
                    class="col-span-2"
                    searchable
                    searchable-placeholder="Buscar campo..."
                    placeholder="Seleccionar campo email..."
                    size="xl"
                    icon="i-heroicons-envelope"
                    value-attribute="label"
                    option-attribute="label"
                    :options="columns" />
                  <UInput
                    :value="mappingPreview(mapping.email)"
                    class="col-span-3"
                    variant="none"
                    placeholder="Seleccionar campo email..."
                    size="xl"
                    readonly
                    icon="i-heroicons-envelope" />
                </div>
                <div class="grid grid-cols-6 gap-1 sm:gap-5 px-2 sm:px-4 pt-2">
                  <p class="text-gray-900 dark:text-white place-content-center">Fecha Matrimonio</p>
                  <USelectMenu
                    v-model="mapping.user_name"
                    class="col-span-2"
                    searchable
                    searchable-placeholder="Buscar campo..."
                    placeholder="Seleccionar campo de matrimonio..."
                    size="xl"
                    icon="i-heroicons-calendar"
                    value-attribute="label"
                    option-attribute="label"
                    :options="columns" />
                  <UInput
                    :value="mappingPreview(mapping.user_name)"
                    placeholder="Seleccionar campo matrimonio..."
                    class="col-span-3"
                    variant="none"
                    size="xl"
                    readonly
                    icon="i-heroicons-calendar" />
                </div>
                <div class="grid grid-cols-6 gap-1 sm:gap-5 px-2 sm:px-4 pt-2">
                  <p class="text-gray-900 dark:text-white place-content-center">Equipo base</p>
                  <USelectMenu
                    v-model="mapping.user_sex"
                    searchable
                    class="col-span-2"
                    searchable-placeholder="Buscar campo..."
                    placeholder="Seleccionar campo de equipo..."
                    size="xl"
                    icon="i-heroicons-users"
                    value-attribute="label"
                    option-attribute="label"
                    :options="columns" />
                  <UInput
                    :value="mappingPreview(mapping.user_sex)"
                    placeholder="Seleccionar campo equipo..."
                    class="col-span-3"
                    variant="none"
                    size="xl"
                    readonly
                    icon="i-heroicons-users" />
                </div>
                <div class="grid grid-cols-6 gap-1 sm:gap-5 px-2 sm:px-4 pt-2">
                  <p class="text-gray-900 dark:text-white place-content-center">Fecha de Pilotaje</p>
                  <USelectMenu
                    v-model="mapping.user_lastname"
                    searchable
                    class="col-span-2"
                    searchable-placeholder="Buscar campo..."
                    placeholder="Seleccionar campo de pilotaje..."
                    size="xl"
                    icon="i-heroicons-calendar"
                    value-attribute="label"
                    option-attribute="label"
                    :options="columns" />
                  <UInput
                    :value="mappingPreview(mapping.user_lastname)"
                    placeholder="Seleccionar campo pilotaje..."
                    class="col-span-3"
                    variant="none"
                    size="xl"
                    readonly
                    icon="i-heroicons-calendar" />
                </div>
                <div class="grid grid-cols-6 gap-1 sm:gap-5 px-2 sm:px-4 pt-2">
                  <p class="text-gray-900 dark:text-white place-content-center">Fecha de Alianza</p>
                  <USelectMenu
                    v-model="mapping.user_lastname"
                    searchable
                    class="col-span-2"
                    searchable-placeholder="Buscar campo..."
                    placeholder="Seleccionar campo de Alianza..."
                    size="xl"
                    icon="i-heroicons-calendar"
                    value-attribute="label"
                    option-attribute="label"
                    :options="columns" />
                  <UInput
                    :value="mappingPreview(mapping.user_lastname)"
                    placeholder="Seleccionar campo Alianza..."
                    class="col-span-3"
                    variant="none"
                    size="xl"
                    readonly
                    icon="i-heroicons-calendar" />
                </div>
                <div class="grid grid-cols-6 gap-1 sm:gap-5 px-2 sm:px-4 pt-2">
                  <p class="text-gray-900 dark:text-white place-content-center">Número celular</p>
                  <USelectMenu
                    v-model="mapping.user_lastname"
                    searchable
                    class="col-span-2"
                    searchable-placeholder="Buscar campo..."
                    placeholder="Seleccionar campo de apellidos..."
                    size="xl"
                    icon="i-heroicons-device-phone-mobile"
                    value-attribute="label"
                    option-attribute="label"
                    :options="columns" />
                  <UInput
                    :value="mappingPreview(mapping.user_lastname)"
                    placeholder="Seleccionar campo Apellidos..."
                    class="col-span-3"
                    variant="none"
                    size="xl"
                    readonly
                    icon="i-heroicons-device-phone-mobile" />
                </div>
              </UCard>
            </div>
          </template>
          <!-- <template #validate>
            <div v-if="!isValidated" class="grid place-content-center" style="height: calc(100dvh - 330px);">
              <UButton  color="gray" icon="i-heroicons-shield-check" :disabled="isValidateDisabled" :loading="isLoading" @click="validateData">
                <span class="hidden sm:block">Validar</span>
              </UButton>
            </div>
            <div v-if="isValidated" class="border-2 border-grey-100 dark:border-primary-900 rounded-md mx-5" style="height: calc(100dvh - 330px);">
              <BTabs v-model="validationTab" :items="validationTabs">
                <template #results>
                  <UDashboardCard
                    v-for="(stat) in errorStats"
                    class="rounded-none"
                    :title="stat.label"
                    :description="`Se encontraron ${stat.value} registros`"
                    :icon="stat.icon"
                    :links="stat.label == 'Registros válidos' ? [{ label: 'Crear', color: 'green', trailingIcon: 'i-heroicons-plus-circle', click: createUsers, disabled: (stat.value <= 0) }] : []"
                  />
                </template>
                <template #error>
                  <UTable
                    :rows="computedErrorRows"
                    :columns="errorColumns"
                    :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
                    style="height: calc(100dvh - 430px);"
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
                </template>
                <template #valid>
                  <UTable
                    :rows="computedValidRows"
                    :columns="columns"
                    :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
                    style="height: calc(100dvh - 430px);"
                    sort-mode="manual">
                  </UTable>
                  <UDivider/>
                  <UPagination
                    v-model="validPage"
                    :page-count="pageCount"
                    :total="totalValidRows"
                    class="place-content-end p-2"/>
                </template>
              </BTabs>
            </div>
          </template> -->
        </UAccordion>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>