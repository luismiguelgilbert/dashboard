<script setup lang="ts">
import type { DashboardSidebarLink } from '#ui-pro/types'

const appConfig = useAppConfig()
const state = useUser()
const { isHelpSlideoverOpen } = useDashboard()

const userMenu = computed<Array<DashboardSidebarLink>>(() => {
  return state.value.menuData.filter((menu) => !menu.parent)
    .map(menu => { 
      const children = state.value.menuData.filter((child) => child.parent === menu.id)
        .map(x => { return {
          label: x.name_es,
          to: x.link!,
        }
      })

      return {
        label: menu.name_es,
        icon: menu.icon!,
        to: menu.id === '0' ? '/' : undefined,
        children: menu.id != '0' ? children : undefined
      }
    })
})

//Load Menu Data
const { data:menuData, error:menuError } = await useFetch('/api/system/userMenu')
if (menuError.value) { navigateTo('/auth/login') }
if (!menuError.value && menuData.value) {
  state.value.menuData = menuData.value
}


//Load User Data
const { data:userData, error:userError } = await useFetch('/api/system/userData')
if (userError.value) { navigateTo('/auth/login') }
if (!userError.value && userData.value) {
  
  state.value.userData = userData.value.userData
  state.value.userCompanies = userData.value.userCompanies
  state.value.userCompany = userData.value.userCompany.id
  state.value.theme = userData.value.userData.dark_enabled ? 'dark' : 'light'
  state.value.preferedColor = state.value.userData.default_color ?? 'indigo'
  appConfig.ui.primary = state.value.preferedColor
  state.value.preferedDarkColor = state.value.userData.default_dark_color ?? 'cool'
  appConfig.ui.gray = state.value.preferedDarkColor
}

const footerLinks = [{
  label: 'Invite people',
  icon: 'i-heroicons-plus',
  to: '/settings/members'
}, {
  label: 'Help & Support',
  icon: 'i-heroicons-question-mark-circle',
  click: () => isHelpSlideoverOpen.value = true
}]

// const groups = [{
//   key: 'links',
//   label: 'Go to',
//   // commands: links.map(link => ({ ...link, shortcuts: link.tooltip?.shortcuts }))
//   commands: userMenu.value.map(link => ({ ...link, shortcuts: link.tooltip?.shortcuts }))
// }, {
//   key: 'code',
//   label: 'Code',
//   commands: [{
//     id: 'source',
//     label: 'View page source',
//     icon: 'i-simple-icons-github',
//     click: () => {
//       window.open(`https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${route.path === '/' ? '/index' : route.path}.vue`, '_blank')
//     }
//   }]
// }]
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
      <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
        <template #left>
          <CompaniesDropdown />
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <UDashboardSidebarLinks :links="userMenu" />
        <UDivider />
        <div class="flex-1" />
        <UDashboardSidebarLinks :links="footerLinks" />
        <UDivider class="sticky bottom-0" />
        <template #footer>
          <!-- ~/components/UserDropdown.vue -->
          <UserDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <suspense>
      <slot />
    </suspense>

    <!-- ~/components/HelpSlideover.vue -->
    <!-- <HelpSlideover /> -->
    <!-- ~/components/NotificationsSlideover.vue -->
    <!-- <NotificationsSlideover /> -->

    <!-- <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly> -->
  </UDashboardLayout>
</template>
