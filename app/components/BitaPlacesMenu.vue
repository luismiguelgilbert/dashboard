<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()

const { currentRoute, push } = useRouter();
const userCompany = useState<sys_companies | undefined>('userCompany');
const userBitaPlaces = useState<bitacora_places[]>('userBitaPlaces');
const userBitaPlace = useState<bitacora_places | undefined>('userBitaPlace');

const userBitaPlacesFormatted = computed(() => {
  return [userBitaPlaces.value
    .filter(place => place.sys_company_id === userCompany.value?.id)
    .map(place => ({
      label: place.name_es_short,
      value: place.id,
      avatar: {
        src: place.avatar_url,
        alt: place.name_es
      },
      class: 'cursor-pointer',
      async onSelect() {
        userBitaPlace.value = userBitaPlaces.value.find(p => p.id === place.id);
        // In case the currentRoute is a nested Child within the company (e.g. an eventID that belongs to a company)
        // then we need to remove the eventID from the route
        if (currentRoute.value.matched.length > 1 && currentRoute.value.matched[0]?.name) {
        await navigateTo({ name: currentRoute.value.matched[0].name, params: { company: userCompany.value?.id, placeId: place.id }, query: useRoute().query });
        } else {
          await push({ params: { placeId: place.id }, query: useRoute().query });
        }
      }
    }
  ))]
})
</script>

<template>
  <UFormField
    v-if="userBitaPlacesFormatted[0]?.length && userBitaPlacesFormatted[0]?.length > 0"
    size="sm"
    :ui="{ description: 'pl-3' }"
    description="Punto de Control:">
    <UDropdownMenu
      :items="userBitaPlacesFormatted"
      :content="{ align: 'center', collisionPadding: 12 }"
      :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }">
      <UButton
        :label="userBitaPlace?.name_es_short"
        :avatar="{
          src: userBitaPlace?.avatar_url ?? undefined,
          alt: userBitaPlace?.name_es_short
        }"
        :trailing-icon="collapsed ? undefined : 'i-lucide-chevrons-up-down'"
        color="neutral"
        variant="ghost"
        :square="collapsed"
        class="data-[state=open]:bg-elevated cursor-pointer"
        :class="collapsed ? 'pl-3' : undefined"
        block
        :ui="{
          trailingIcon: 'text-dimmed'
        }" />
    </UDropdownMenu>
  </UFormField>
</template>
