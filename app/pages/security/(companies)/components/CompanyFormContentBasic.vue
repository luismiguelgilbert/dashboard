<script setup lang="ts">
const props = defineProps<{
  disable: boolean;
}>();

const moduleStore = useSecurityCompaniesStore();
const { selectedRecordId, selectedRowData } = storeToRefs(moduleStore);
const myForm = useTemplateRef('myForm');
</script>

<template>
  <div
    v-if="selectedRecordId && selectedRowData"
    class="m-1 md:m-6">
    <div class="pb-2 md:pb-5">
      <p class="font-bold pb-0 text-xl">
        Datos de la Organización
      </p>
      <p class="text-(--ui-text-muted)">
        Datos básicos de la organización
      </p>
    </div>
    <UCard variant="subtle">
      <UForm
        ref="myForm"
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="sys_companies_schema">
        <UiDashboardSection
          name="is_active"
          label="Estado"
          hint="Activar/Inactivar organización">
          <USwitch
            v-model="selectedRowData.is_active"
            :label="selectedRowData.is_active ? 'Activo' : 'Inactivo'" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
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
          name="company_number"
          label="RUC"
          hint="Registro único de contribuyente">
          <UInput
            v-model="selectedRowData.company_number"
            class="w-full"
            placeholder="Registro único de contribuyente"
            icon="i-lucide-id-card" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          name="billing_address"
          label="Dirección de Facturación"
          hint="Nombre del usuario">
          <UInput
            v-model="selectedRowData.billing_address"
            class="w-full"
            placeholder="Dirección de Facturación"
            icon="i-lucide-map-pin-house" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          name="billing_phone"
          label="Teléfono de Facturación"
          hint="Nombre del usuario">
          <UInput
            v-model="selectedRowData.billing_phone"
            class="w-full"
            placeholder="Teléfono de Facturación"
            icon="i-lucide-phone" />
        </UiDashboardSection>
        <br>
      </UForm>
    </UCard>
    <br><br>
  </div>
</template>
