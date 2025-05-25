<script setup lang="ts">
const props = defineProps<{
  disable: boolean;
}>();

const moduleStore = useSecurityUsersStore();
const { selectedRowData } = storeToRefs(moduleStore);
const myForm = useTemplateRef('myForm');

const isCreating = computed<boolean>(() => Boolean(selectedRowData.value?.is_new));

defineExpose({
  validateForm: async () => {
    return await myForm.value?.validate();
  },
});
</script>

<template>
  <div
    v-if="selectedRowData"
    class="m-1 md:m-6">
    <div class="pb-2 md:pb-5">
      <p class="font-bold pb-0 text-xl">
        Datos del Usuario
      </p>
      <p class="text-(--ui-text-muted)">
        Datos básicos del usuario
      </p>
    </div>
    <UCard variant="subtle">
      <UForm
        ref="myForm"
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="sys_users_schema">
        <UiDashboardSection
          name="email"
          label="Email"
          hint="Correo o nombre usado como inicio de sesión">
          <UInput
            v-model="selectedRowData.email"
            class="w-full"
            placeholder="Email del usuario (login)"
            icon="i-lucide-at-sign"
            :disabled="!isCreating" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          name="is_active"
          label="Estado"
          hint="Activar/Inactivar usuario">
          <USwitch
            v-model="selectedRowData.is_active"
            :label="selectedRowData.is_active ? 'Activo' : 'Inactivo'" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          name="user_name"
          label="Nombres"
          hint="Nombre del usuario">
          <UInput
            v-model="selectedRowData.user_name"
            class="w-full"
            placeholder="Nombres del usuario"
            icon="i-lucide-user" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          name="user_lastname"
          label="Apellidos"
          hint="Nombre del usuario">
          <UInput
            v-model="selectedRowData.user_lastname"
            class="w-full"
            placeholder="Apellidos del usuario"
            icon="i-lucide-user-round" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          name="user_sex"
          label="Sexo"
          hint="Nombre del usuario">
          <USwitch
            v-model="selectedRowData.user_sex"
            :label="selectedRowData.user_sex ? 'Masculino' : 'Femenino'" />
        </UiDashboardSection>
        <br>
      </UForm>
    </UCard>
    <br><br>
  </div>
</template>
