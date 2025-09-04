<script setup lang="ts">
import { DateTime } from 'luxon';

const userCompany = useState<sys_companies | undefined>('userCompany');
const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');
const dateStart = ref<string>();
const dateEnd = ref<string>();
const payload = computed(() => ({
  start: dateStart.value,
  end: dateEnd.value
}));
const tableColumns = [
  { accessorKey: 'visitor_name', header: 'Nombre del Visitante' },
  { accessorKey: 'visit', header: 'Fecha' },
  { accessorKey: 'visit_start', header: 'Desde' },
  { accessorKey: 'visit_end', header: 'Hasta' },
  { accessorKey: 'visited_name', header: 'Visita a' },
  { accessorKey: 'reason_name', header: 'Motivo' },
  { accessorKey: 'visited_area', header: 'Área' },
  { accessorKey: 'visitor_company', header: 'Compañía' },
  { accessorKey: 'comments_in', header: 'Comentario' },
];
const { data, error, pending } = await useFetch(`/api/${userCompany.value?.id}/bitacora/${userBitaPlace.value?.id}/visits-report`, { method: 'POST', body: payload });
</script>

<template>
  <UDashboardPanel id="bita-visits-report" class="lg:ml-5 border-l border-l-neutral-200 dark:border-l-neutral-800">
    <UDashboardNavbar title="Reporte de Visitas">
      <template #leading>
        <UDashboardSidebarCollapse class="cursor-pointer" />
      </template>
    </UDashboardNavbar>
    <div class="grid md:flex items-center py-2 px-4 gap-x-5 gap-y-3">
      Desde:
      <UiInputDateCalendar
        v-model="dateStart" />
      Hasta:
      <UiInputDateCalendar
        v-model="dateEnd" />
    </div>
    <USeparator />
    <div v-if="dateStart && dateEnd">
      <div class="overflow-y-auto">
        <div class="grid md:flex items-start gap-10 p-3 border-b border-default">
          <div>
            <UUser
              size="2xl"
              :name="userCompany?.name_es_short"
              :description="userCompany?.name_es"
              :avatar="{
                src: userCompany?.avatar_url!,
                icon: 'i-lucide-image'
              }" />
          </div>
          <div class="grid">
            <span class="text-xl font-black">Detalle de Ingresos/Salidas - {{ userBitaPlace?.name_es }}</span>
            <span class="text-xl font-bold"></span>
            <span>
              Desde: <b class="text-muted">{{ `${DateTime.fromFormat(dateStart, '').setLocale('es-EC').toFormat('dd/MMMM/yyyy') }` }}</b>
              Hasta: <b class="text-muted">{{ `${DateTime.fromFormat(dateEnd, '').setLocale('es-EC').toFormat('dd/MMMM/yyyy') }` }}</b>
            </span>
          </div>
          <!-- <UBlogPost
            title="Detalle de Ingresos/Salidas"
            :date="userBitaPlace?.name_es"
             /> -->
          <!-- <UUser
            class="p-3 pl-3 pr-6"
            size="2xl"
            :name="userCompany?.name_es_short"
            :description="`${DateTime.fromJSDate(executionDate).setLocale('es-EC').toFormat('dd/MMMM/yyyy HH:mm') }`"
            :avatar="{
              src: userCompany?.avatar_url || undefined,
              icon: 'i-lucide-image'
            }"/> -->
        </div>
        <UTable
          v-if="!error"
          class="w-full"
          :columns="tableColumns"
          :data="data"
          :loading="pending"
          :ui="{
            td: 'p-2 text-sm font-medium text-black dark:text-white border-r border-default',
            th: 'px-4 py-2 text-sm text-black dark:text-white text-left font-semibold border-r border-default',
          }"
          loading-animation="carousel">
          <template #visitor_name-cell="{ row }">
            <UUser
              :name="row.original.visitor_name"
              :avatar="{ src: row.original.avatar_url || undefined, icon: 'i-lucide-image'}" />
          </template>
          <template #visit-cell="{ row }">
            <span>{{ DateTime.fromSQL(row.original.visit_start).setLocale('es-EC').toFormat('dd/MMMM/yyyy') }}</span>
          </template>
          <template #visit_start-cell="{ row }">
            <span>{{ DateTime.fromSQL(row.original.visit_start).setLocale('es-EC').toFormat('HH:mm') }}</span>
          </template>
          <template #visit_end-cell="{ row }">
            <span v-if="row.original.visit_end">{{ DateTime.fromSQL(row.original.visit_end).setLocale('es-EC').toFormat('HH:mm') }}</span>
          </template>
        </UTable>
        <span v-else class="text-red-500 p-3">
          {{ error.message }}
        </span>
      </div>
    </div>
  </UDashboardPanel>
</template>