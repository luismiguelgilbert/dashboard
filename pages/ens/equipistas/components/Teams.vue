<script setup lang="ts">
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const { state } = useEnsEquipistasForm();
const inputUI = { icon: { leading: { wrapper: 'content-start items-start pt-2.5' }, base: 'text-gray-400' } };
const isTeamsOpen = ref(false);
const addTeamId = ref<string>('');
const addTeamDateStart = ref(null);
const addTeamDatePilotaje = ref(null);
const addTeamDateStop = ref(null);
//COMPUTED PROPS
const addTeamDisabled = computed(() => !addTeamId.value || !addTeamDateStart.value );

//LOOKUP DATA
const { data: dataTeams } = useFetch('/api/lookups/ens_teams');
const { data: dataServices } = useFetch('/api/lookups/ens_services');
state.value.teams = dataTeams.value ?? [];
state.value.services = dataServices.value ?? [];

//Actions
const addTeam = () => {
  state.value.data_teams.push({
  id: '',
  team_id: addTeamId.value,
  team_name_es: state.value.teams.find(team => team.id === addTeamId.value)?.name_es ?? '',
  fecha_alianza: addTeamDateStart.value,
  fecha_pilotaje: addTeamDatePilotaje.value,
  fecha_salida: addTeamDateStop.value,
  user_id: '',
});
  isTeamsOpen.value = false;
};
</script>

<template>
  <SkeletonForm v-if="props.loading" />
  <div v-else>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-2 sm:px-4 content-start">
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Equipo:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Equipo base del equipista.
        </p>
        <UButton
          class="mt-3"
          color="white"
          label="Agregar equipo"
          trailing-icon="i-heroicons-plus-circle"
          @click="isTeamsOpen = true" />
  
        <UModal v-model="isTeamsOpen">
          <div class="p-4">
            <UFormGroup
              label="Equipo"
              required>
              <USelectMenu
                v-model="addTeamId"
                searchable-placeholder="Buscar equipo..."
                placeholder="Seleccionar equipo..."
                size="xl"
                icon="i-heroicons-users"
                searchable
                value-attribute="id"
                option-attribute="name_es"
                :options="state.teams" />
            </UFormGroup>
            
            <UFormGroup
              label="Fecha de Acogida"
              class="mt-3"
              required>
              <UPopover
                :popper="{ placement: 'bottom-start' }"
                class="w-full">
                <UInput
                  :value="addTeamDateStart ? format(addTeamDateStart, 'd MMM, yyy', { locale: es }) : undefined"
                  class="w-full"
                  required
                  label="Código"
                  size="xl"
                  readonly
                  placeholder="Fecha de Acogida"
                  icon="i-heroicons-calendar-days"
                  :ui="inputUI" />
                <template #panel="{ close }">
                  <DatePicker
                    v-model="addTeamDateStart"
                    is-required
                    @close="close" />
                </template>
              </UPopover>
            </UFormGroup>
  
            <UFormGroup
              label="Inicio de Pilotaje"
              class="mt-3">
              <UPopover
                :popper="{ placement: 'bottom-start' }"
                class="w-full">
                <UInput
                  :value="addTeamDatePilotaje ? format(addTeamDatePilotaje, 'd MMM, yyy', { locale: es }) : undefined"
                  class="w-full"
                  required
                  label="Código"
                  size="xl"
                  readonly
                  placeholder="Fecha de Acogida"
                  icon="i-heroicons-calendar-days"
                  :ui="inputUI" />
                <template #panel="{ close }">
                  <DatePicker
                    v-model="addTeamDatePilotaje"
                    is-required
                    @close="close" />
                </template>
              </UPopover>
            </UFormGroup>
  
            <UFormGroup
              label="Fecha de Salida del equipo"
              class="mt-3">
              <UPopover
                :popper="{ placement: 'bottom-start' }"
                class="w-full">
                <UInput
                  :value="addTeamDateStop ? format(addTeamDateStop, 'd MMM, yyy', { locale: es }) : undefined"
                  class="w-full"
                  required
                  label="Código"
                  size="xl"
                  readonly
                  placeholder="Fecha de Acogida"
                  icon="i-heroicons-calendar-days"
                  :ui="inputUI" />
                <template #panel="{ close }">
                  <DatePicker
                    v-model="addTeamDateStop"
                    is-required
                    @close="close" />
                </template>
              </UPopover>
            </UFormGroup>
  
  
            <UButton
              block
              class="mt-3"
              color="primary"
              label="Agregar"
              :disabled="addTeamDisabled"
              @click="addTeam" />
          </div>
        </UModal>
      </div>
  
      <UCard
        :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
        class="mt-2 sm:mt-0">
        <ul
          role="list"
          class="divide-y divide-gray-200 dark:divide-gray-800">
          <li
            v-for="(team, index) in state.data_teams"
            :key="index"
            class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6">
            <div class="flex items-center gap-3 min-w-0">
              <div class="text-sm min-w-0">
                <p class="text-gray-900 dark:text-white font-medium truncate">
                  {{ team.team_name_es }}
                </p>
                <p
                  v-if="team.fecha_alianza"
                  class="text-gray-500 dark:text-gray-400 truncate">
                  Fecha de acogida: {{ format(team.fecha_alianza, 'd MMM, yyy', { locale: es }) }}
                </p>
                <p
                  v-if="team.fecha_pilotaje"
                  class="text-gray-500 dark:text-gray-400 truncate">
                  Inicio de pilotaje: {{ format(team.fecha_pilotaje, 'd MMM, yyy', { locale: es }) }}
                </p>
                <p
                  v-if="team.fecha_salida"
                  class="text-gray-500 dark:text-gray-400 truncate">
                  Fecha de salida: {{ format(team.fecha_salida, 'd MMM, yyy', { locale: es }) }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </UCard>
  
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Servicios:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Servicios que ha brindado el equipista.
        </p>
        <UButton
          class="mt-3"
          color="white"
          label="Agregar Servicio"
          trailing-icon="i-heroicons-plus-circle"
          @click="isTeamsOpen = true" />
      </div>
      <UCard
        :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
        class="min-w-0"
      >
      </UCard>
    </div>
    <br /> <br />
  </div>
</template>