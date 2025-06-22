<script setup lang="ts">
const props = defineProps<{
  disable: boolean;
}>();

const moduleStore = useSecurityProfilesStore();
const { selectedRowData } = storeToRefs(moduleStore);
</script>

<template>
  <div
    v-if="selectedRowData"
    class="m-4 md:m-6">
    <UPageFeature
      title="Datos del Perfil"
      description="Datos básicos del perfil" />
    <br>

    <UCard variant="subtle">
      <UForm
        ref="myForm"
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="sys_profiles_schema">
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
          name="name_es"
          label="Nombre del perfil"
          hint="Nombre descriptivo del perfil">
          <UInput
            v-model="selectedRowData.name_es"
            class="w-full"
            placeholder="Nombre descriptivo del perfil"
            icon="i-lucide-shield-user" />
        </UiDashboardSection>
        <br>
      </UForm>
    </UCard>
    <br>
  </div>
</template>
