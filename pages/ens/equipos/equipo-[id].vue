<script setup lang="ts">
import { tabs } from './components/config';
import Basic from './components/basic.vue';
import Users from './components/users.vue';

const route = useRoute();
const { state } = useEnsEquipos();

const tab = ref('basic');
const isRightPanelOpen = ref(true);
state.value.selectedId = String(route.params.id);

console.log('load team data here');

// const save = async () => {
//   const { start, finish } = useLoadingIndicator();
//   try {
//     await form.value.validate();
//     start();
//     state.value.isLoading = true;
//     await ens_teams.validate(state.value.selectedTeam);
//     //Update Team
//     if(state.value.selectedTeam?.id){
//       await $fetch(`/api/ens/equipos/:${state.value.selectedTeam.id}`, {
//         method: 'patch',
//         body: state.value.selectedTeam,
//       });
//       //Notify and Emit
//       useToast().add({
//         title: 'Datos guardados correctamente',
//         icon: 'i-heroicons-check-circle',
//         timeout: 1500,
//       });
//       emits('data-saved', state.value.selectedTeam);
//     }
//   } catch (error) {
//     let errorMessage = 'Error desconocido';
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     }
//     useToast().add({
//       title: 'Error',
//       description: errorMessage,
//       icon: 'i-heroicons-exclamation-triangle',
//       color: 'rose',
//       timeout: 5000,
//     });

//   } finally {
//     state.value.isLoading = false;
//     finish();
//   }
// };

</script>

<template>
  <div>
    <UDashboardPanel
      v-model="isRightPanelOpen"
      collapsible
      grow
      side="right">
      <UDashboardNavbar
        title="Editar Equipo"
        class="sticky top-0 z-10 bg-white dark:bg-gray-900">
        <template #toggle>
          <UDashboardNavbarToggle icon="i-heroicons-x-mark" />
        </template>
        <template #right>
          <UButton
            label="Guardar"
            icon="i-heroicons-check-circle" />
        </template>
      </UDashboardNavbar>
      <BTabs
        v-model="tab"
        :items="tabs"
        class="sticky top-0 z-10 bg-white dark:bg-gray-900">
        <template #basic>
          <Basic />
        </template>
        <template #users>
          <Users />
        </template>
      </BTabs>
    </UDashboardPanel>
  </div>
</template>