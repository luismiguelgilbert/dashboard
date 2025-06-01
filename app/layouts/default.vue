<script setup lang="ts">
const open = ref(false);
const { loggedIn } = useUserSession();
if (!loggedIn.value) navigateTo('/auth/login?session_error=true');

const userMenu = useState<sys_links[]>('userMenu');
const requestFetch = useRequestFetch();
const { data } = await useAsyncData(() => requestFetch('/api/system/userMenu'));
userMenu.value = data.value || [];

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

// const groups = computed(() => [{
//   id: 'links',
//   label: 'Go to',
//   items: links.flat()
// }])
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
        <TeamsMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <!-- <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" /> -->

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

    <!-- <UDashboardSearch :groups="groups" /> -->

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
