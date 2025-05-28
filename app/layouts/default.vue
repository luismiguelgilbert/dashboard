<script setup lang="ts">
const open = ref(false);

const links = [
  [
    {
      label: 'Home',
      icon: 'i-lucide-house',
      to: '/',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'Sistema',
      icon: 'i-lucide-cog',
      defaultOpen: true,
      children: [
        {
          label: 'Usuarios',
          icon: 'i-lucide-users',
          to: '/security/users',
          onSelect: () => {
            open.value = false
          }
        },
        {
          label: 'Organizaciones',
          icon: 'i-lucide-building-2',
          to: '/security/companies',
          onSelect: () => {
            open.value = false
          }
        }
      ]
    },
    {
      label: 'Settings',
      to: '/settings',
      icon: 'i-lucide-settings',
      defaultOpen: true,
      children: [{
        label: 'General',
        to: '/settings',
        exact: true,
        onSelect: () => {
          open.value = false
        }
      }, {
        label: 'Members',
        to: '/settings/members',
        onSelect: () => {
          open.value = false
        }
      }, {
        label: 'Notifications',
        to: '/settings/notifications',
        onSelect: () => {
          open.value = false
        }
      }, {
        label: 'Security',
        to: '/settings/security',
        onSelect: () => {
          open.value = false
        }
      }]
    }]
]

const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: links.flat()
}])
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
        footer: 'lg:border-t lg:border-default'
      }">
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          popover
          orientation="vertical" />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
