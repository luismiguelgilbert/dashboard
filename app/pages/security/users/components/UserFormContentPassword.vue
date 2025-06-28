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
      title="Contraseña"
      description="Cambiar la contraseña del usuario" />
    <br>

    <UCard variant="subtle">
      <UForm
        v-if="selectedRowData"
        ref="myForm"
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="sys_users_schema">
        <UiDashboardSection
          :vertical="vertical"
          name="sys_profile_id"
          label="Cambiar contraseña">
          <USwitch v-model="selectedRowData.change_password" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="new_password"
          label="Nueva Contraseña"
          hint="Ingrese la nueva contraseña del usuario">
          <UInput
            v-model="selectedRowData.new_password"
            class="w-full"
            :disabled="!selectedRowData.change_password"
            placeholder="Escriba la nueva contraseña"
            icon="i-lucide-user" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          :vertical="vertical"
          name="new_password_confirm"
          label="Confirmar Contraseña"
          hint="Confirme la nueva contraseña del usuario">
          <UInput
            v-model="selectedRowData.new_password_confirm"
            :disabled="!selectedRowData.change_password"
            class="w-full"
            placeholder="Confirme la nueva contraseña"
            icon="i-lucide-user-round" />
        </UiDashboardSection>
        <br>
      </UForm>
    </UCard>
    <br>
  </div>
</template>
