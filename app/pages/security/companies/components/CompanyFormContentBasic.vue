<script setup lang="ts">
const props = defineProps<{
  disable: boolean;
  vertical?: boolean;
}>();

const moduleStore = useSecurityCompaniesStore();
const { selectedRowData } = storeToRefs(moduleStore);
</script>

<template>
  <div
    v-if="selectedRowData"
    class="m-4 md:m-6">
    <UPageFeature
      title="Datos de la Organización"
      description="Datos básicos de la organización" />
    <br>

    <UCard variant="subtle">
      <UForm
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="sys_companies_schema">
        <UiDashboardSection
          :vertical="vertical"
          name="is_active"
          label="Estado"
          hint="Activar/Inactivar organización">
          <USwitch
            v-model="selectedRowData.is_active"
            :label="selectedRowData.is_active ? 'Activo' : 'Inactivo'" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="name_es_short"
          label="Nombre"
          hint="Nombre de la organización">
          <UInput
            v-model="selectedRowData.name_es_short"
            class="w-full"
            placeholder="Nombre de la organización"
            icon="i-lucide-store" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="name_es"
          label="Razón Social"
          hint="Razón social de la organización">
          <UInput
            v-model="selectedRowData.name_es"
            class="w-full"
            placeholder="Razón social de la organización"
            icon="i-lucide-building-2" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="company_number"
          label="RUC"
          hint="Registro único de contribuyente">
          <UInput
            v-model="selectedRowData.company_number"
            class="w-full"
            inputmode="numeric"
            placeholder="Registro único de contribuyente"
            icon="i-lucide-id-card" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="billing_phone"
          label="Teléfono de Facturación"
          hint="Nombre del usuario">
          <UInput
            v-model="selectedRowData.billing_phone"
            class="w-full"
            inputmode="numeric"
            placeholder="Teléfono de Facturación"
            icon="i-lucide-phone" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="billing_address"
          label="Dirección de Facturación"
          hint="Nombre del usuario"
          label-top>
          <UTextarea
            v-model="selectedRowData.billing_address"
            class="w-full"
            placeholder="Dirección de Facturación"
            icon="i-lucide-map-pin-house" />
        </UiDashboardSection>
        <br>
      </UForm>
    </UCard>
    <br><br>
  </div>
</template>
