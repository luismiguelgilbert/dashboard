<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()

const { currentRoute, push } = useRouter();
const userCompanies = useState<sys_companies[]>('userCompanies');
const userCompany = useState<sys_companies | undefined>('userCompany');
const userBitaPlaces = useState<bitacora_places[]>('userBitaPlaces');
const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');

const userCompaniesFormatted = computed(() => {
  return [userCompanies.value.map(company => ({
    label: company.name_es_short,
    value: company.id,
    avatar: {
      src: company.avatar_url,
      alt: company.name_es
    },
    class: 'cursor-pointer',
    async onSelect() {
      userCompany.value = userCompanies.value.find(c => c.id === company.id);
      // In case the currentRoute is a nested Child within the company (e.g. a recordID that belongs to a company)
      // then we need to remove the recordID from the route
      if (currentRoute.value.matched.length > 1 && currentRoute.value.matched[0]?.name) {
        await navigateTo({ name: currentRoute.value.matched[0].name, params: { company: company.id }, query: useRoute().query });
      } else {
        await push({ params: { company: company.id }, query: useRoute().query });
      }
      // If user has Bitacora places, we can also set the first place as the current one
      if (userBitaPlace.value?.id && userBitaPlaces.value.length > 0) {
        const firstPlaceForCompany = userBitaPlaces.value.find(p => p.sys_company_id === userCompany.value?.id);
        if (firstPlaceForCompany) {
          userBitaPlace.value = firstPlaceForCompany;
        }
      } else {
        userBitaPlace.value = undefined;
      }
    }
  }))]
})
</script>

<template>
  <UDropdownMenu
    :items="userCompaniesFormatted"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }">
    <!-- class="data-[state=open]:bg-elevated cursor-pointer h-full" -->
    <!-- :class="collapsed ? 'pl-3' : undefined" -->
    <UButton
      :label="userCompany?.name_es_short"
      :avatar="{
        src: userCompany?.avatar_url ?? undefined,
        alt: userCompany?.name_es_short
      }"
      :trailing-icon="collapsed ? undefined : 'i-lucide-chevrons-up-down'"
      color="neutral"
      variant="link"
      :square="collapsed"
      class="w-full h-full cursor-pointer rounded-none"
      block
      :ui="{
        trailingIcon: 'text-dimmed'
      }" />
  </UDropdownMenu>
</template>
