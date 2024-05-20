<script setup lang="ts">
const { state } = useSecurityUsersBatch();

const mappingPreview = (field: string | null) => {
  if (field) {
    const firstRow = state.value.rows[0];
    return firstRow[field];
  }
};
const { data: profileOptions } = await useLazyFetch('/api/lookups/sys_profiles');
const { data: companyOptions } = await useFetch('/api/lookups/sys_companies');

const profileOptionsFormatted = computed(() => profileOptions.value?.map(p => ({ ...p, disabled: !p.is_active })));
const companyOptionsFormatted = computed(() => companyOptions.value?.map(p => ({ ...p, disabled: !p.is_active })));
const isValidateDisabled = computed(() => state.value.isLoading || state.value.rows.length === 0 || !state.value.mapping.email || !state.value.mapping.user_name || !state.value.mapping.user_lastname || !state.value.mapping.user_sex || !state.value.mapping.sys_profile_id || !state.value.mapping.prefered_company_id);

const validateData = async () => {
  try {
    state.value.isLoading = true;
    const { error, data } = await useFetch('/api/users/bulk-create-validate', {
      method: 'post',
      body: {
        mapping: state.value.mapping,
        users: state.value.rows,
      },
    });
    if (error || data.value?.length) {
      state.value.resultsError  = data.value?.filter(row => Boolean(row.errors?.length)) ?? [];
      state.value.resultsValid  = data.value?.filter(row => !row.errors?.length) ?? [];
    }
    state.value.isValidated = true;
  } catch (error) {
    console.error(error);
  } finally {
    state.value.isLoading = false;
  }
};
</script>

<template>
  <div 
    class="p-4 w-full h-[calc(100dvh-115px)] overflow-scroll">
    <div class="grid grid-cols-7 gap-1 sm:gap-5 px-2 sm:px-4">
      <p class="text-gray-900 dark:text-white font-semibold">
        Dato:
      </p>
      <p class="col-span-3 text-gray-900 dark:text-white font-semibold">
        Columna en el archivo:
      </p>
      <p class="col-span-3 text-gray-900 dark:text-white font-semibold pl-5">
        Vista Previa:
      </p>
    </div>
    
    <UDivider class="col-span-1 sm:col-span-3 my-2" />

    <div class="grid grid-cols-7 gap-1 sm:gap-5 px-2 sm:px-4 mt-5">
      <p class="text-gray-900 dark:text-white place-content-center">
        Email
      </p>
      <USelectMenu
        v-model="state.mapping.email"
        class="col-span-3"
        searchable
        searchable-placeholder="Buscar campo..."
        placeholder="Seleccionar campo email..."
        size="xl"
        icon="i-heroicons-envelope"
        value-attribute="label"
        option-attribute="label"
        :options="state.columns" />
      <UInput
        :value="mappingPreview(state.mapping.email)"
        class="col-span-3"
        variant="none"
        placeholder="Seleccionar campo email..."
        size="xl"
        readonly
        icon="i-heroicons-envelope" />
    </div>
    <div class="grid grid-cols-7 gap-1 sm:gap-5 px-2 sm:px-4 pt-2">
      <p class="text-gray-900 dark:text-white place-content-center">
        Nombres
      </p>
      <USelectMenu
        v-model="state.mapping.user_name"
        class="col-span-3"
        searchable
        searchable-placeholder="Buscar campo..."
        placeholder="Seleccionar campo de nombres..."
        size="xl"
        icon="i-heroicons-user"
        value-attribute="label"
        option-attribute="label"
        :options="state.columns" />
      <UInput
        :value="mappingPreview(state.mapping.user_name)"
        placeholder="Seleccionar campo Nombres..."
        class="col-span-3"
        variant="none"
        size="xl"
        readonly
        icon="i-heroicons-user" />
    </div>
    <div class="grid grid-cols-7 gap-1 sm:gap-5 px-2 sm:px-4 pt-2">
      <p class="text-gray-900 dark:text-white place-content-center">
        Apellidos
      </p>
      <USelectMenu
        v-model="state.mapping.user_lastname"
        searchable
        class="col-span-3"
        searchable-placeholder="Buscar campo..."
        placeholder="Seleccionar campo de apellidos..."
        size="xl"
        icon="i-heroicons-user"
        value-attribute="label"
        option-attribute="label"
        :options="state.columns" />
      <UInput
        :value="mappingPreview(state.mapping.user_lastname)"
        placeholder="Seleccionar campo Apellidos..."
        class="col-span-3"
        variant="none"
        size="xl"
        readonly
        icon="i-heroicons-user" />
    </div>
    <div class="grid grid-cols-7 gap-1 sm:gap-5 px-2 sm:px-4 pt-2">
      <p class="text-gray-900 dark:text-white place-content-center">
        Sexo
      </p>
      <USelectMenu
        v-model="state.mapping.user_sex"
        searchable
        class="col-span-3"
        searchable-placeholder="Buscar campo..."
        placeholder="Seleccionar campo de sexo..."
        size="xl"
        icon="i-heroicons-user"
        value-attribute="label"
        option-attribute="label"
        :options="state.columns" />
      <UInput
        :value="mappingPreview(state.mapping.user_sex)"
        placeholder="Seleccionar campo Sexo..."
        class="col-span-3"
        variant="none"
        size="xl"
        readonly
        icon="i-heroicons-user" />
    </div>
    <div class="grid grid-cols-7 gap-1 sm:gap-5 px-2 sm:px-4 pt-2">
      <p class="text-gray-900 dark:text-white place-content-center">
        Perfil
      </p>
      <USelectMenu
        v-model="state.mapping.sys_profile_id"
        class="col-span-5"
        searchable
        searchable-placeholder="Buscar campo..."
        placeholder="Seleccionar rol..."
        size="xl"
        icon="i-heroicons-user-circle"
        value-attribute="id"
        option-attribute="name_es"
        :options="profileOptionsFormatted" />
    </div>
    <div class="grid grid-cols-7 gap-1 sm:gap-5 px-2 sm:px-4 pt-2">
      <p class="text-gray-900 dark:text-white place-content-center">
        Organización
      </p>
      <USelectMenu
        v-model="state.mapping.prefered_company_id"
        class="col-span-5"
        searchable
        searchable-placeholder="Buscar campo..."
        placeholder="Seleccionar organización..."
        size="xl"
        icon="i-heroicons-building-office-2"
        value-attribute="id"
        option-attribute="name_es_short"
        :options="companyOptionsFormatted" />
    </div>

    <div class="grid place-content-center mt-5">
      <UButton
        color="primary"
        icon="i-heroicons-shield-check"
        :disabled="isValidateDisabled"
        :loading="state.isLoading"
        @click="validateData">
        <span class="hidden sm:block">Validar</span>
      </UButton>
    </div>
  </div>
</template>