<script setup lang="ts">
const props = defineProps<{
  disable: boolean;
}>();

const headers = useRequestHeaders(['cookie']);
const moduleStore = useSecurityUsersStore();
const { selectedRecordId, selectedRowData } = storeToRefs(moduleStore);
const myForm = useTemplateRef('myForm');

const {
  data: lookupProfiles,
  isFetching: isFetchingLookupProfiles,
} = useQuery({
  queryKey: ['lookup-profiles'],
  queryFn: () => $fetch('/api/lookup/sys_profiles', { method: 'get', headers }),
  staleTime: 1000 * 60 * 5, // 5 minutes
});

const {
  data: lookupCompanies,
} = useQuery({
  queryKey: ['lookup-companies'],
  queryFn: () => $fetch('/api/lookup/sys_companies', { method: 'get', headers }),
  staleTime: 1000 * 60 * 5, // 5 minutes
});
</script>

<template>
  <div
    v-if="selectedRecordId && selectedRowData"
    class="m-4 md:m-6">
    <div class="pb-2 md:pb-5">
      <p class="font-bold pb-0 text-xl">
        Perfil y Organizaciones
      </p>
      <p class="text-(--ui-text-muted)">
        Roles y organizaciones a las que puede acceder el usuario
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
          <USelectMenu
            v-model="selectedRowData.sys_profile_id"
            :items="lookupProfiles"
            :loading="isFetchingLookupProfiles"
            class="w-full"
            placeholder="Perfil del usuario"
            icon="i-lucide-user"
            value-key="id"
            label-key="name_es" />
        </UiDashboardSection>
        <USeparator class="py-5" />
        <UiDashboardSection
          name="sys_companies_users"
          label="Organizaciones"
          hint="Permitir acceso a las organizaciones seleccionadas"
          label-top>
          <UCheckboxGroup
            v-model="selectedRowData.sys_companies_users"
            :items="lookupCompanies?.filter(c => !c.disabled)"
            variant="table"
            value-key="id"
            label-key="name_es_short"
            description-key="name_es" />
        </UiDashboardSection>
        <br>
      </UForm>
    </UCard>
    <br><br>
  </div>
</template>
