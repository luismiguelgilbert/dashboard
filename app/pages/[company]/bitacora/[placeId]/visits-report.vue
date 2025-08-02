<script setup lang="ts">
import { sub } from 'date-fns';
import { DateTime } from 'luxon';
import type { Range } from '~/types'

const userCompany = useState<sys_companies | undefined>('userCompany');
const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');
const executionDate = new Date();
const dateRange = shallowRef<Range>({
  start: sub(new Date(), { days: 7 }),
  end: new Date()
});
const { data, error, pending } = await useFetch(`/api/${userCompany.value?.id}/bitacora/${userBitaPlace.value?.id}/visits-report`, {method: 'POST', body: dateRange.value });
</script>

<template>
  <UDashboardPanel id="bita-visits-report" >
    <UDashboardNavbar title="Reporte de Visitas">
      <template #leading>
        <UDashboardSidebarCollapse class="cursor-pointer" />
      </template>
    </UDashboardNavbar>
    <div class="grid md:flex justify-between items-center p-2">
      <div class="flex items-center">
        <span class="hidden sm:flex">Fecha:</span>
        <UiInputDateRange v-model="dateRange" />
      </div>
      <div>
        <UButton
          label="Generar Reporte"
          color="primary"
          variant="solid"
          icon="i-lucide-file-text"
          :disabled="!userCompany || !userBitaPlace" />
      </div>
    </div>
    <USeparator />
    <div class="overflow-y-auto">
      <div class="grid md:flex justify-between items-start gap-2 p-3 border-b border-default">
        <UBlogPost
          title="Detalle de Ingresos/Salidas"
          :date="userBitaPlace?.name_es"
          :description="`Desde: ${DateTime.fromJSDate(dateRange.start).setLocale('es-EC').toFormat('dd/MMMM/yyyy HH:mm')} - Hasta: ${DateTime.fromJSDate(dateRange.end).setLocale('es-EC').toFormat('dd/MMMM/yyyy HH:mm')}`" />
        <UUser
          class="p-3 pl-3 pr-6"
          size="2xl"
          :name="userCompany?.name_es_short"
          :description="`${DateTime.fromJSDate(executionDate).setLocale('es-EC').toFormat('dd/MMMM/yyyy HH:mm') }`"
          :avatar="{
            src: userCompany?.avatar_url || undefined,
            icon: 'i-lucide-image'
          }"/>
      </div>
      <UTable
        v-if="!error"
        class="w-full"
        :data="data"
        :loading="pending"
        loading-animation="carousel" />
      <span v-else class="text-red-500 p-3">
        {{ error.message }}
      </span>
    </div>
  </UDashboardPanel>
</template>