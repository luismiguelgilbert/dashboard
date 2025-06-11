<script setup lang="ts">
const props = defineProps<{
  disable: boolean;
}>();

const moduleStore = useSecurityProfilesStore();
const { selectedRecordId, selectedRowData } = storeToRefs(moduleStore);
const myForm = useTemplateRef('myForm');
</script>

<template>
  <div
    v-if="selectedRecordId && selectedRowData"
    class="m-1 md:m-6">
    <div class="pb-2 md:pb-5">
      <p class="font-bold pb-0 text-xl">
        Datos del Perfil
      </p>
      <p class="text-(--ui-text-muted)">
        Datos básicos del perfil
      </p>
    </div>
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
            icon="i-lucide-building-2" />
        </UiDashboardSection>
        <br>
      </UForm>
    </UCard>
    <br><br>
  </div>
</template>
