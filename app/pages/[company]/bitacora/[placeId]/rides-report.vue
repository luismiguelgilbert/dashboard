<script setup lang="ts">
import { sub } from 'date-fns';
import type { Range } from '~/types'

const userCompany = useState<sys_companies | undefined>('userCompany');
const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');
const dateRange = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
</script>

<template>
  <UDashboardPanel
    id="bitacora-visits-report"
    :default-size="30"
    :min-size="50"
    :max-size="80"
    resizable>
    <UDashboardNavbar title="Reporte de Visitas">
      <template #leading>
        <UDashboardSidebarCollapse class="cursor-pointer" />
      </template>
    </UDashboardNavbar>
    <UDashboardToolbar>
      <template #left>
        Fecha:
        <UiInputDateRange v-model="dateRange" />
      </template>
      <template #right>
        <UButton
          label="Generar Reporte"
          color="primary"
          variant="solid"
          icon="i-lucide-file-text"
          :disabled="!userCompany || !userBitaPlace" />
      </template>
    </UDashboardToolbar>
    <h1>Visits Report for Place ID: {{ userBitaPlace?.id }}</h1>
    <p>Company: {{ userCompany?.name_es }}</p>
    <p>Desde: {{ dateRange.start }}</p>
    <p>Hasta: {{ dateRange.end }}</p>
  </UDashboardPanel>
</template>