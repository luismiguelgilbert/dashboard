<script setup lang="ts">
const open = ref(false);
const { loggedIn, fetch: refreshSession } = useUserSession();
if (!loggedIn.value) navigateTo('/auth/login?session_error=true');

const appConfig = useAppConfig();
const { currentRoute } = useRouter();
const userMenu = useState<sys_links[]>('userMenu');
const userCompanies = useState<sys_companies[]>('userCompanies');
const userCompany = useState<sys_companies | undefined>('userCompany');
const userBitaPlaces = useState<bitacora_places[]>('userBitaPlaces');
const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');
const nuxtColorToneMode = useLocalStorage('nuxt-color-tone-mode', 'slate');
const nuxtColorAccentMode = useLocalStorage('nuxt-color-accent-mode', 'bitt');

appConfig.ui.colors.neutral = nuxtColorToneMode.value;
appConfig.ui.colors.primary = nuxtColorAccentMode.value;

const requestFetch = useRequestFetch();
const { data: menuData } = await useAsyncData(() => requestFetch('/api/system/userMenu'));
userMenu.value = menuData.value || [];
const { data: companiesData } = await useAsyncData(() => requestFetch('/api/system/userCompanies'));
userCompanies.value = companiesData.value || [];
userCompany.value = useRoute().params.company
  ? userCompanies.value.find(c => c.id === useRoute().params.company)
  : userCompanies.value[0];
const { data: bitaPlaces } = await useAsyncData(() => requestFetch('/api/system/userBitaPlaces'));
userBitaPlaces.value = bitaPlaces.value || [];
userBitaPlace.value = useRoute().params.placeId
  ? userBitaPlaces.value.find(c => c.id === useRoute().params.placeId)
  : userBitaPlaces.value[0];

await refreshSession();
const userMenuFormatted = computed(() => {
  return [
    {
      label: 'Inicio',
      class: 'cursor-pointer',
      icon: 'i-lucide-house',
      to: '/',
    },
    ...userMenu.value.filter(x => x.row_level === 0)
      .map(rootItem => ({
        ...rootItem,
        label: rootItem.name_es,
        defaultOpen: false, // boolean to keep the root item open
        children: userMenu.value.filter(x => x.parent === rootItem.id)
          .map(childItem => ({
            ...childItem,
            label: `${childItem.name_es}`,
            to: childItem.link
              .replace('company?', userCompany.value?.id || '')
              .replace('placeId?', userBitaPlace.value?.id || ''),
            disabled: currentRoute.value.path.includes(childItem.link),
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
      class="bg-neutral-100 dark:bg-neutral-800/30 mt-2 ml-2 mb-2 rounded-2xl min-h-min border shadow-xl"
      :ui="{
        header: 'h-(--ui-header-height) shrink-0 flex items-center gap-1.5 px-0 pt-safe border-b border-b-neutral-200 dark:border-b-neutral-800',
        footer: 'lg:border-t lg:border-default h-15 p-0',
        body: 'flex flex-col flex-1 overflow-y-auto p-0 py-2 gap-1.5',
      }">
      <template #header="{ collapsed }">
        <CompaniesMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <BitaPlacesMenu
          v-if="userBitaPlaces.length > 0"
          :collapsed="collapsed" />
        <span v-if="!collapsed" class="text-dimmed text-sm pl-2">Aplicaciones:</span>
        <UNavigationMenu
          :collapsed="collapsed"
          :items="userMenuFormatted"
          :ui="{ link: 'text-md' }"
          popover
          :class="{ 'px-4': collapsed, 'px-2': !collapsed  }"
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
