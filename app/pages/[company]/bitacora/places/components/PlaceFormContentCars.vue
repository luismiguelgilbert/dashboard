<script setup lang="ts">
import { useQuery} from '@tanstack/vue-query';
const props = defineProps<{
  disable: boolean;
  vertical?: boolean;
}>();

const headers = useRequestHeaders(['cookie']);
const userCompany = useState<sys_companies | undefined>('userCompany');
const moduleStore = useBitacoraPlacesStore();
const { selectedRowData } = storeToRefs(moduleStore);
const searchTerm = ref('');
const selectedCars = computed(() => lookupCars.value?.filter(car => selectedRowData.value?.bita_places_cars.includes(car.id)) || []);

const groups = computed(() => [{
  id: 'cars',
  label: searchTerm.value ? `Buscando vehículos con “${searchTerm.value}”...` : 'Vehículos',
  items: lookupCars.value || [],
}]);


const {
  data: lookupCars,
  isFetching: isFetchingLookupCars,
} = useQuery({
  queryKey: ['lookup-bitacora-cars', userCompany.value?.id],
  queryFn: () => $fetch(`/api/lookup/${userCompany.value?.id}/bitacora/cars`, { method: 'get', headers })
    .then((data => {
      return data?.map((car: lookup_bitacora_cars) => ({
        id: car.id,
        label: car.name_es,
        suffix: car.name_es_short,
        disabled: car.disabled,
        class: car.disabled ? 'line-through' : undefined,
        avatar: {
          src: car.is_active ? (car.avatar_url || '') : '',
          icon: car.is_active ? 'i-lucide-image' : 'i-lucide-ban',
        },
        onSelect() {
          if (selectedRowData.value) {
            selectedRowData.value.bita_places_cars = [...selectedRowData.value.bita_places_cars, car.id];
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
      title="Vehículos">

      <template #trailing>
        <UBadge
          :label="selectedRowData.bita_places_cars.length"
          variant="subtle" />
      </template>

      <template #right>
        <UDrawer
          :handle="false"
          :overlay="false"
          direction="right">
          <UButton
            label="Agregar vehículos"
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
              placeholder="Buscar vehículo...">
              <template #item-trailing="item">
                <UIcon
                  v-if="selectedRowData.bita_places_cars.includes(item.item.id)"
                  name="i-lucide-circle-check"
                  class="size-5" />
              </template>
            </UCommandPalette>
          </template>
        </UDrawer>
      </template>
    </UDashboardNavbar>
    <UCard
      class="mx-2 md:mx-4"
      variant="subtle">
      <UProgress v-if="isFetchingLookupCars" class="p-3" />
      <span v-if="!selectedCars.length">No hay vehículos seleccionados</span>
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
          @click="selectedRowData.bita_places_cars = selectedRowData.bita_places_cars.filter(id => id !== car.id)" />
      </div>
    </UCard>
    <br>
  </div>
</template>