<script setup lang="ts">
const props = defineProps<{
  disable: boolean;
}>();

const moduleStore = useSecurityUsersStore();
const { selectedRecordId, selectedRowData } = storeToRefs(moduleStore);
</script>

<template>
  <div
    v-if="selectedRecordId && selectedRowData"
    class="m-4 md:m-6">
    <div class="pb-2 md:pb-5">
      <p class="font-bold pb-0 text-xl">
        Contraseña
      </p>
      <p class="text-(--ui-text-muted)">
        Cambiar la contraseña del usuario
      </p>
    </div>
    <UCard variant="subtle">
      <UForm
        v-if="selectedRowData"
        ref="myForm"
        :disabled="props.disable"
        :state="selectedRowData"
        :schema="sys_users_schema">
        <UiDashboardSection
          name="sys_profile_id"
          label="Perfil"
          hint="Permisos del usuario (roles)">
          <USwitch
            v-model="selectedRowData.change_password"
            label="Cambiar contraseña" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          name="new_password"
          label="Nueva Contraseña"
          hint="Ingrese la nueva contraseña del usuario">
          <UInput
            v-model="selectedRowData.new_password"
            class="w-full"
            placeholder="Escriba la nueva contraseña"
            icon="i-lucide-user" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          name="new_password_confirm"
          label="Confirmar Contraseña"
          hint="Confirme la nueva contraseña del usuario">
          <UInput
            v-model="selectedRowData.new_password_confirm"
            class="w-full"
            placeholder="Confirme la nueva contraseña"
            icon="i-lucide-user-round" />
        </UiDashboardSection>
        <br>
      </UForm>
    </UCard>
    <br><br>
  </div>
</template>
