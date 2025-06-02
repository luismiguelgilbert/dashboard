<script setup lang="ts">
const open = ref(false);
const { loggedIn } = useUserSession();
if (!loggedIn.value) navigateTo('/auth/login?session_error=true');

const userMenu = useState<sys_links[]>('userMenu');
const userCompanies = useState<sys_companies[]>('userCompanies');
const userCompany = useState<sys_companies | undefined>('userCompany');
const requestFetch = useRequestFetch();
const { data: menuData } = await useAsyncData(() => requestFetch('/api/system/userMenu'));
userMenu.value = menuData.value || [];
const { data: companiesData } = await useAsyncData(() => requestFetch('/api/system/userCompanies'));
userCompanies.value = companiesData.value || [];
userCompany.value = userCompanies.value[0];

const userMenuFormatted = computed(() => {
  return [
    {
      label: 'Home',
      icon: 'i-lucide-house',
      to: '/',
      onSelect: () => {
        open.value = false
      }
    },
    ...userMenu.value.filter(x => x.row_level === 0)
      .map(rootItem => ({
        ...rootItem,
        label: rootItem.name_es,
        class: 'cursor-pointer',
        defaultOpen: true,
        children: userMenu.value.filter(x => x.parent === rootItem.id)
          .map(childItem => ({
            ...childItem,
            label: childItem.name_es!,
            to: childItem.link,
            class: 'cursor-pointer',
            onSelect: () => {
              open.value = false;
            }
          }))
      }))
  ]
});
</script>

<template>
  <UDashboardGroup
    unit="rem"
    class="pt-safe">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{
        header: 'h-(--ui-header-height) shrink-0 flex items-center gap-1.5 px-4 pt-safe',
        footer: 'lg:border-t lg:border-default h-15 p-0'
      }">
      <template #header="{ collapsed }">
        <CompaniesMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="userMenuFormatted"
          popover
          orientation="vertical" />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
