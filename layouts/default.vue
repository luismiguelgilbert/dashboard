<script setup lang="ts">
import type { DashboardSidebarLink } from '#ui-pro/types';

const colorMode = useColorMode();
const appConfig = useAppConfig();
const { sessionData, handleUnauthorized } = useUserSession();
colorMode.preference = 'dark';

const userMenu = computed<Array<DashboardSidebarLink>>(() => {
  return sessionData.value?.userMenuData?.filter((menu) => !menu.parent)
    .map(menu => { 
      const children = sessionData.value?.userMenuData?.filter((child) => child.parent === menu.id)
        .map(x => { return {
          label: x.name_es!,
          to: x.link!,
          icon: '',
        };
      });

      return {
        label: menu.name_es!,
        icon: menu.icon!,
        to: menu.id === '0' ? '/' : undefined,
        children: menu.id != '0' ? children : undefined,
      };
    }) ?? [];
});

const { data, error, refresh } = await useFetch('/api/system/userData');
if (error.value) { error.value?.statusCode === 401 && handleUnauthorized(refresh) ;}
if (!error.value && data.value) {
  sessionData.value.userData = data.value.userData;
  sessionData.value.userCompanies = data.value.userCompanies;
  sessionData.value.userMenuData = data.value.userMenu;
  //Preset colors:
  colorMode.preference = sessionData.value.userData.dark_enabled ? 'dark' : 'light';
  appConfig.ui.primary = sessionData.value.userData.default_color!;
  appConfig.ui.gray = sessionData.value.userData.default_dark_color!;
  //Select default Company
  const defaultCompanyID = data.value.userCompanies?.find((company) => company.is_default)?.id;
  if (defaultCompanyID) {
    sessionData.value.userCompany = defaultCompanyID;
  } else {
    const firstActiveCompanyID = data.value.userCompanies?.find(c => c.is_active)?.id;
    sessionData.value.userCompany = firstActiveCompanyID ?? null;
  }
}
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel
      class="bg-gray-50 dark:bg-gray-800"
      :width="300"
      :resizable="{ min: 200, max: 300 }"
      collapsible>
      <UDashboardNavbar
        class="!border-transparent"
        :ui="{ left: 'flex-1' }">
        <template #left>
          <CompaniesDropdown />
        </template>
        <template #right>
          <UColorModeToggle />
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <UDashboardSidebarLinks
          :links="userMenu"
          :ui="{ 
            label: 'text-lg lg:text-sm truncate relative',
            active: 'text-primary-500 dark:text-primary-400 before:bg-gray-100 dark:before:bg-gray-800',
            dot: {
              wrapper: 'w-px h-full mx-[9.5px] bg-gray-200 dark:bg-gray-700 relative',
              after: 'after:absolute after:z-[1] after:w-px after:h-full after:bg-gray-200 after:dark:bg-gray-700 after:transform after:translate-y-full',
              base: 'w-1 h-1 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
              active: 'bg-primary-400 dark:bg-primary',
              inactive: 'bg-gray-400 dark:bg-gray-500 group-hover:bg-gray-700 dark:group-hover:bg-gray-200'
            },
          }" />
        <UDivider class="sticky bottom-0" />
        <template #footer>
          <UserDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <suspense>
      <NuxtPage />
    </suspense>
  </UDashboardLayout>
</template>
