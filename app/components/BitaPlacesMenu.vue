<script setup lang="ts">
const { collapsed } = defineProps<{
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
  <div class="border-b border-b-neutral-800 pb-2">
    <span v-if="!collapsed" class="text-dimmed text-sm pl-2">Punto de Control:</span>
    <UDropdownMenu
      :items="userBitaPlacesFormatted"
      :content="{ align: 'center', collisionPadding: 12 }"
      :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }">
      <UButton
        :label="collapsed ? undefined : userBitaPlace?.name_es_short"
        :avatar="{
          src: userBitaPlace?.avatar_url ?? undefined,
          alt: userBitaPlace?.name_es_short
        }"
        :trailing-icon="collapsed ? undefined : 'i-lucide-chevrons-up-down'"
        color="neutral"
        variant="link"
        :square="collapsed"
        class="w-full cursor-pointer rounded-none"
        block
        :ui="{
          trailingIcon: 'text-dimmed'
        }" />
    </UDropdownMenu>
  </div>
</template>
