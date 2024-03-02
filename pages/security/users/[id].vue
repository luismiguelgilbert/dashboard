<script setup lang="ts">
import { type type_sys_companies } from '~/types/server/sys_companies';
import { type type_sys_users } from '~/types/server/sys_users';

const { isLoading, userData, userCompanies } = useSecurityUsersForm();

const tabs = [
  { value: 'basic', label: 'Información', icon: 'i-heroicons-user-circle', defaultOpen: true },
  { value: 'companies',label: 'Compañías', icon: 'i-heroicons-swatch', defaultOpen: false },
  { value: 'avatar',label: 'Avatar', icon: 'i-heroicons-swatch', defaultOpen: false },
];
const tab = ref<'basic'|'companies'|'avatar'>('basic');
isLoading.value = false;

const route = useRoute();
if (route.params.id) {
  const { data } = await useFetch<type_sys_users[]>(`/api/users/${route.params.id}`);
  userData.value = data.value?.[0]!;
  const { data: companiesData } = await useFetch<type_sys_companies[]>(`/api/users/${route.params.id}/companies`);
  companiesData.value?.forEach((company) => {
    userCompanies.value.push(company.id);
  });
}

const cancel = async () => {
  isLoading.value = true;
  await navigateTo('/security/users');
};
const save = async() => {
  isLoading.value = true;
  await navigateTo('/security/users');
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Editar Usuario">
        <template #right>
          <UButton label="Regresar" color="gray" icon="i-heroicons-arrow-left-circle" :disabled="isLoading" @click="cancel" />
          <UButton label="Guardar" icon="i-heroicons-check-circle" :disabled="isLoading" @click="save" />
        </template>
      </UDashboardNavbar>
      <BTabs
        v-model="tab"
        :items="tabs"
      />
      <UDashboardPanelContent>
        <SystemUsersBasic v-show="tab === 'basic'" />
        <SystemUsersCompanies v-show="tab === 'companies'" />
        <SystemUsersAvatar v-show="tab === 'avatar'" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>