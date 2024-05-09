<script setup lang="ts">
import type { DashboardSidebarLink } from '#ui-pro/types'

const colorMode = useColorMode()
const appConfig = useAppConfig()
const { sessionData } = useUserSession();
colorMode.preference = 'dark'

const userMenu = computed<Array<DashboardSidebarLink>>(() => {
  return sessionData.value?.userMenuData?.filter((menu) => !menu.parent)
    .map(menu => { 
      const children = sessionData.value?.userMenuData?.filter((child) => child.parent === menu.id)
        .map(x => { return {
          label: x.name_es!,
          to: x.link!,
          icon: '',
        }
      })

      return {
        label: menu.name_es,
        icon: menu.icon!,
        to: menu.id === '0' ? '/' : undefined,
        children: menu.id != '0' ? children : undefined,
      }
    }) ?? [];
})


const { data, error } = await useFetch('/api/system/userData')
if (error.value) { await navigateTo('/auth/login') }
if (!error.value && data.value) {
  sessionData.value.userData = data.value.userData;
  sessionData.value.userCompanies = data.value.userCompanies;
  sessionData.value.userMenuData = data.value.userMenu;
  //Preset colors:
  colorMode.preference = sessionData.value.userData.dark_enabled ? 'dark' : 'light';
  appConfig.ui.primary = sessionData.value.userData.default_color;
  appConfig.ui.gray = sessionData.value.userData.default_dark_color;
  //Select default Company
  const defaultCompanyID = data.value.userCompanies?.find((company) => company.is_default)?.id;
  if (defaultCompanyID) {
    sessionData.value.userCompany = defaultCompanyID;
  } else {
    const firstActiveCompanyID = data.value.userCompanies?.find(c => c.is_active)?.id
    sessionData.value.userCompany = firstActiveCompanyID ?? null;
  }
}
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
      <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
        <template #left>
          <CompaniesDropdown />
        </template>
        <template #right>
          <UColorModeToggle />
        </template>

      </UDashboardNavbar>

      <UDashboardSidebar>
        <UDashboardSidebarLinks :links="userMenu" />
        <UDivider class="sticky bottom-0" />
        <template #footer>
          <UserDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <suspense>
      <slot />
      <!-- <NuxtPage /> -->
      <!-- <Nuxt /> -->
    </suspense>
  </UDashboardLayout>
</template>
