<script setup lang="ts">
const open = ref(false);
const { loggedIn } = useUserSession();
if (!loggedIn.value) navigateTo('/auth/login?session_error=true');

const { currentRoute } = useRouter();
const userMenu = useState<sys_links[]>('userMenu');
const userCompanies = useState<sys_companies[]>('userCompanies');
const userCompany = useState<sys_companies | undefined>('userCompany');
const userBitaPlaces = useState<bitacora_places[]>('userBitaPlaces');
const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');

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
        defaultOpen: true,
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
      class="bg-elevated/25"
      :ui="{
        header: 'h-(--ui-header-height) shrink-0 flex items-center gap-1.5 px-4 pt-safe',
        footer: 'lg:border-t lg:border-default h-15 p-0'
      }">
      <template #header="{ collapsed }">
        <CompaniesMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <BitaPlacesMenu
          v-if="userBitaPlaces.length > 0"
          :collapsed="collapsed" />
        <UNavigationMenu
          :collapsed="collapsed"
          :items="userMenuFormatted"
          :ui="{ link: 'text-md' }"
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
