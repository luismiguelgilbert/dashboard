<script setup lang="ts">
const props = defineProps<{
  disable: boolean;
  vertical?: boolean;
}>();

const moduleStore = useSecurityUsersStore();
const { selectedRowData } = storeToRefs(moduleStore);
</script>

<template>
  <div
    v-if="selectedRowData"
    class="m-4 md:m-6">
    <UPageFeature
      title="Datos del Usuario"
      description="Datos básicos del usuario" />
    <br>

    <UCard variant="subtle">
      <UForm
        ref="myForm"
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="sys_users_schema">
        <UiDashboardSection
          :vertical="vertical"
          name="email"
          label="Email"
          hint="Correo o id usado como inicio de sesión">
          <UInput
            v-model="selectedRowData.email"
            :disabled="!selectedRowData.is_new"
            class="w-full"
            placeholder="Email del usuario (login)"
            icon="i-lucide-at-sign" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="is_active"
          label="Estado"
          hint="Activar/Inactivar usuario">
          <USwitch
            v-model="selectedRowData.is_active"
            :label="selectedRowData.is_active ? 'Activo' : 'Inactivo'" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="user_name"
          label="Nombres"
          hint="Nombres del usuario">
          <UInput
            v-model="selectedRowData.user_name"
            class="w-full"
            placeholder="Nombres del usuario"
            icon="i-lucide-user" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="user_lastname"
          label="Apellidos"
          hint="Apellidos del usuario">
          <UInput
            v-model="selectedRowData.user_lastname"
            class="w-full"
            placeholder="Apellidos del usuario"
            icon="i-lucide-user-round" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="user_sex"
          label="Sexo"
          hint="Sexo del usuario">
          <USwitch
            v-model="selectedRowData.user_sex"
            :label="selectedRowData.user_sex ? 'Masculino' : 'Femenino'" />
        </UiDashboardSection>
        <br>
      </UForm>
    </UCard>
    <br>
  </div>
</template>
