<script setup lang="ts">
import type { type_sys_companies } from '~/types/server/sys_companies';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
});

const { state } = useSecurityUsersForm();
const toast = useToast();

const isCompanySelected = (selectedCompany: type_sys_companies): boolean => {
  return Boolean(state.value.data.userCompanies.some(company => company === selectedCompany.id));
};

const toggleCompany = (selectedCompany: type_sys_companies): void => {
  const isCompanyFound = state.value.data.userCompanies?.some(company => company === selectedCompany.id);
  const isPreferredCompany = state.value.data.userData.prefered_company_id === selectedCompany.id;
  if (isCompanyFound) {
    if (!isPreferredCompany) {
      state.value.data.userCompanies = state.value.data.userCompanies.filter(company => company !== selectedCompany.id);
    } else {
      toast.add({
        title: 'Organización preferida',
        description: 'No puede desactivar la Organización preferida del usuario.',
        icon: 'i-heroicons-no-symbol',
        color: 'rose',
        timeout: 2000,
      });
    }
  } else {
    state.value.data.userCompanies.push(selectedCompany.id);
  }
};
//LOOKUP DATA
const { data: companyOptionsData } = await useLazyFetch('/api/lookups/sys_companies');
state.value.companyOptions = companyOptionsData.value ?? [];
watch(companyOptionsData, (newData) => { if (newData?.length) { state.value.companyOptions = newData ?? []; } });
</script>

<template>
  <SkeletonHeader v-if="props.loading" />
  <div
    v-else
    class="pl-6 pr-6 md:pl-2 md:pr-4 pt-4 md:pt-0">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-2 sm:px-4">
      <div class="col-span-1 sm:col-span-2 pt-1" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Organizaciones:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Organizaciones a las que tiene acceso el usuario.
        </p>
      </div>

      <UCard
        :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
        class="min-w-0">
        <ul
          role="list"
          class="divide-y divide-gray-200 dark:divide-gray-800">
          <li
            v-for="(company, index) in state.companyOptions"
            :key="index"
            class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6">
            <div class="flex items-center gap-3 min-w-0">
              <div class="text-sm min-w-0">
                <p class="text-gray-900 dark:text-white font-medium truncate">
                  {{ company.name_es_short }}
                  <b
                    v-if="!company.is_active"
                    class="text-red-500 italic">Desactivada</b>
                </p>
                <p class="text-gray-500 dark:text-gray-400 truncate">
                  {{ company.name_es }}
                </p>
              </div>
            </div>
    
            <div class="flex items-center gap-3">
              <UToggle
                :model-value="isCompanySelected(company)"
                :disabled="state.isLoading"
                @update:model-value="toggleCompany(company)" />
            </div>
          </li>
        </ul>
      </UCard>
    </div>
    <br /> <br />
  </div>
</template>