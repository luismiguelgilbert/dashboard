<script setup lang="ts">
import Excel from 'exceljs';
import { type type_sys_profiles } from '@/types/server/sys_profiles';
import { type type_sys_companies } from '@/types/server/sys_companies';

//REF PROPS
type columns = {
  key: string,
  label: string,
  sortable: boolean
}
const rows = ref([]);
const columns = ref<unknown[]>([]);
const pageCount = 50;
const page = ref(1);
const tab = ref('file');
const isLoading = ref(false);
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
    { slot: 'table', value: 'table', label: '2. Ver Datos', icon: 'i-heroicons-table-cells', defaultOpen: tab.value === 'table' },
    { slot: 'mapping',value: 'mapping', label: '3. Definiciones', icon: 'i-heroicons-adjustments-horizontal', defaultOpen: tab.value === 'mapping' },
    { slot: 'validate',value: 'validate', label: '4. Validar', icon: 'i-heroicons-document-check', defaultOpen: tab.value === 'validate' },
    { slot: 'upload', value: 'upload', label: '5. Cargar', icon: 'i-heroicons-document-check', defaultOpen: tab.value === 'upload' },
    { slot: 'report', value: 'report', label: '6. Reporte', icon: 'i-heroicons-document-chart-bar', defaultOpen: tab.value === 'report' },
  ]
);
const totalRows = computed(() => rows.value.length);
const profileOptionsFormatted = computed(() => profileOptions.value.map(p => ({ ...p, disabled: p.is_active })));
const computeRows = computed(() => {
  return rows.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

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
    const columnKey = columns.value?.find(c => c.label === field);
    const firstRow = rows.value[0];
    
    if (firstRow && columnKey && columnKey.key) {
      return firstRow[columnKey.key];
    }
  }
  return null;
};

const validateData = async () => {
  console.log('validateData');
};

const { files, open, reset, onChange } = useFileDialog({
  accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  directory: false, // Select directories instead of files if set true
});

onChange(async (files) => {
  if (files && files[0]) {
    try {
      isLoading.value = true;
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

      const workbook = new Excel.Workbook();
      const arrayBuffer = await files[0].arrayBuffer();
      const wb = await workbook.xlsx.load(arrayBuffer);
      wb.eachSheet((sheet, id) => {
        if (id === 1) {
          sheet.getRow(1).eachCell((cell, cellColNumber) => {
            columns.value.push({
              key: `col${cellColNumber}`,
              label: cell.text,
              sortable: false,
            });
          });
        }
      });


      const worksheet = wb.getWorksheet(1)!;

      worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
        if (rowNumber > 1) {
          const rowObject = {};
          row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
            rowObject[`col${colNumber}`] = cell.value;
          });

          rows.value.push(rowObject);
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
})

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Cargar Usuarios" :badge="rows.length">
        <template #right>
          <UButton color="gray" icon="i-heroicons-arrow-left-circle" :disabled="isLoading" @click="cancel">
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
            <div class="grid place-content-center" style="height: calc(100dvh - 450px);">
              <UButton color="gray" icon="i-heroicons-folder-open" :disabled="isLoading" @click="open">
                <span class="hidden sm:block">Cargar</span>
              </UButton>
            </div>
          </template>
          <template #table>
            <div class="border-2 border-grey-100 dark:border-primary-900 rounded-md mx-5" style="height: calc(100dvh - 450px);">
              <UTable
                :rows="computeRows"
                :columns="columns"
                :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
                style="height: calc(100dvh - 500px);"
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
            <div class="overflow-y-scroll px-5" style="height: calc(100dvh - 450px);">
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
            <div class="grid place-content-center" style="height: calc(100dvh - 450px);">
              <UButton color="gray" icon="i-heroicons-shield-check" :disabled="isLoading">
                <span class="hidden sm:block">Validar</span>
              </UButton>
            </div>
          </template>
          <template #upload>
            <div class="grid place-content-center" style="height: calc(100dvh - 450px);">
              <UButton color="gray" icon="i-heroicons-shield-check" :disabled="isLoading">
                <span class="hidden sm:block">Cargar Información</span>
              </UButton>
            </div>
          </template>
          <template #report>
            <div class="grid place-content-center" style="height: calc(100dvh - 450px);">
              <span>Some stats about the results</span>
            </div>
          </template>
        </UAccordion>
      </UDashboardPanelContent>
      <div v-if="tab === 'file'" class="flex justify-center sm:justify-between px-3 py-3.5 sm:border-t border-gray-200 dark:border-gray-700">
        
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>