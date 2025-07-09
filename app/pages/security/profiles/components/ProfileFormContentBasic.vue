<script setup lang="ts">
const props = defineProps<{
  disable: boolean;
  vertical?: boolean;
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
          :vertical="vertical"
          name="is_active"
          label="Estado"
          hint="Activar/Inactivar perfil">
          <USwitch
            v-model="selectedRowData.is_active"
            :label="selectedRowData.is_active ? 'Activo' : 'Inactivo'" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="name_es"
          label="Nombre del perfil"
          hint="Descripción del perfil">
          <UInput
            v-model="selectedRowData.name_es"
            class="w-full"
            placeholder="Descripción del perfil"
            icon="i-lucide-shield-user" />
        </UiDashboardSection>
        <br>
      </UForm>
    </UCard>
    <br>
  </div>
</template>
