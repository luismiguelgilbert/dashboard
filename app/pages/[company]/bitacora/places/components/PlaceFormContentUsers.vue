<script setup lang="ts">
const props = defineProps<{
  disable: boolean;
}>();

const headers = useRequestHeaders(['cookie']);
const userCompany = useState<sys_companies | undefined>('userCompany');
const moduleStore = useBitacoraPlacesStore();
const { selectedRowData } = storeToRefs(moduleStore);
const searchTerm = ref('');
const selectedCars = computed(() => lookupCars.value?.filter(car => selectedRowData.value?.bita_places_users.includes(car.id)) || []);

const groups = computed(() => [{
  id: 'cars',
  label: searchTerm.value ? `Buscando usuarios con “${searchTerm.value}”...` : 'Usuarios',
  items: lookupCars.value || [],
}]);


const {
  data: lookupCars,
  isFetching: isFetchingLookupCars,
} = useQuery({
  queryKey: ['lookup-sys-users', userCompany.value?.id],
  queryFn: () => $fetch(`/api/lookup/${userCompany.value?.id}/sys_users`, { method: 'get', headers })
    .then((data => {
      return data?.map((car: lookup_sys_users) => ({
        id: car.id,
        label: car.label,
        suffix: car.suffix,
        disabled: car.disabled,
        class: car.disabled ? 'line-through' : undefined,
        avatar: {
          src: car.is_active ? (car.avatar_url || '') : '',
          icon: car.is_active ? 'i-lucide-image' : 'i-lucide-ban',
        },
        onSelect() {
          if (selectedRowData.value) {
            selectedRowData.value.bita_places_users = [...selectedRowData.value.bita_places_users, car.id];
          }
        }
      })) || [];
    })),
  staleTime: 1000 * 60 * 5, // 5 minutes
});
</script>

<template>
  <div
    v-if="selectedRowData">
    <UDashboardNavbar
      :toggle="false"
      :ui="{ root: 'border-b-0' }"
      title="Usuarios">

      <template #trailing>
        <UBadge
          :label="selectedRowData.bita_places_users.length"
          variant="subtle" />
      </template>

      <template #right>
        <UDrawer
          :handle="false"
          :overlay="false"
          direction="right">
          <UButton
            label="Agregar usuarios"
            class="cursor-pointer"
            color="neutral"
            variant="subtle"
            icon="i-lucide-car"
            leading-icon="i-lucide-circle-plus" />
          <template #content>
            <UCommandPalette
              v-model:search-term="searchTerm"
              :groups="groups"
              :fuse="{ fuseOptions: { includeMatches: true } }"
              placeholder="Buscar usuarios...">
              <template #item-trailing="item">
                <UIcon
                  v-if="selectedRowData.bita_places_users.includes(item.item.id)"
                  name="i-lucide-circle-check"
                  class="size-5" />
              </template>
            </UCommandPalette>
          </template>
        </UDrawer>
      </template>
    </UDashboardNavbar>
    <UCard
      class="mx-4 md:mx-6"
      variant="subtle">
      <UProgress v-if="isFetchingLookupCars" class="p-3" />
      <span v-if="!selectedCars.length">No hay usuario seleccionados</span>
      <div
        v-for="car in selectedCars"
        :key="car.id"
        class="rounded-sm flex justify-between w-full p-3 border-(--ui-bg) hover:border-l-primary hover:bg-primary/5">
        <UUser
          :name="car.label"
          :description="car.suffix"
          :avatar="car.avatar" />
        <UButton
          class="cursor-pointer"
          color="error"
          variant="ghost"
          icon="i-lucide-trash-2"
          size="xl"
          @click="selectedRowData.bita_places_users = selectedRowData.bita_places_users.filter(id => id !== car.id)" />
      </div>
    </UCard>
    <br>
  </div>
</template>