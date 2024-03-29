<script setup lang="ts">
import { colors, darkColors } from '@/components/home/config';
import { type type_sys_companies } from '@/types/server/sys_companies';

defineProps({
  isEditing: {
    type: Boolean,
    required: false,
    default: false,
  }
})

const { state } = useSecurityCompaniesForm();
const inputUI = { icon: { leading: { wrapper: 'content-start items-start pt-2.5' }, base: 'text-gray-400' } };
const fileRef = ref<{ input: HTMLInputElement }>();

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) { return }
  if (input.files[0].size / 1024 / 1024 > 1) { return }
  state.value.avatar = input.files[0];
  state.value.companyData.avatar_url = URL.createObjectURL(input.files[0]);
};

const onFileClick = () => { fileRef.value?.input.click() };

</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-2 sm:px-4 content-start">
    <div class="col-span-1 sm:col-span-2 pt-1" />
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        RUC:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Registro único de contribuyente de la organización.
      </p>
    </div>
    <UFormGroup name="company_number">
      <!-- v-model:model-value="state.useData.email" -->
      <UInput
        v-model:model-value="state.companyData.company_number"
        size="xl"
        placeholder="RUC de la organización"
        icon="i-heroicons-identification"
        error
        :ui="inputUI"
        :loading="state.isLoading" />
    </UFormGroup>
    
    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Nombre:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Nombre de la organización
      </p>
    </div>
    <UFormGroup name="name_es_short">
      <UInput
        v-model:model-value="state.companyData.name_es_short"
        required
        size="xl"
        placeholder="Nombre de la Organización"
        icon="i-heroicons-building-storefront"
        :ui="inputUI"
        :loading="state.isLoading" />
    </UFormGroup>

    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Razón Social:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Razón social de la organización.
      </p>
    </div>
    <UFormGroup name="name_es">
      <UInput
        v-model:model-value="state.companyData.name_es"
        required
        size="xl"
        placeholder="Razón Social"
        icon="i-heroicons-building-office"
        :ui="inputUI"
        :loading="state.isLoading" />
    </UFormGroup>

    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Estado:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Estado de la organización.
      </p>
    </div>
    <UFormGroup name="is_active">
      <UToggle
        v-model="state.companyData.is_active"
        :disabled="state.isLoading" />
      <span class="ml-5" style="vertical-align: text-bottom;">{{ state.companyData.is_active ? 'Activo' : 'Inactivo' }}</span>
    </UFormGroup>
    
    
    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Avatar:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Foto de la organización (1MB max).
      </p>
    </div>
    <UFormGroup name="avatar_url">
      <div class="flex items-center">
        <UAvatar :src="state.companyData.avatar_url!" :alt="state.companyData.user_lastname" size="lg" />
        <UButton label="Seleccionar" color="white" size="md" @click="onFileClick" class="ml-5" />
        <UInput ref="fileRef" type="file" class="hidden" accept=".jpg, .jpeg, .png, .gif" @change="onFileChange" />
      </div>
    </UFormGroup>

    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Teléfono principal:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Número de teléfono principal de la organización.
      </p>
    </div>
    <UFormGroup name="billing_phone">
      <UInput
        v-model:model-value="state.companyData.billing_phone"
        required
        size="xl"
        placeholder="Teléfono"
        icon="i-heroicons-phone"
        :ui="inputUI"
        :loading="state.isLoading" />
    </UFormGroup>

    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Dirección principal:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Dirección principal de la organización.
      </p>
    </div>
    <UFormGroup name="billing_address">
      <UInput
        v-model:model-value="state.companyData.billing_address"
        required
        size="xl"
        placeholder="Dirección"
        icon="i-heroicons-map-pin"
        :ui="inputUI"
        :loading="state.isLoading" />
    </UFormGroup>
    
    <UDivider v-if="isEditing" class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
    <div v-if="isEditing">
      <p class="text-gray-900 dark:text-white font-semibold">
        Código:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Código reservado para uso del sistema.
      </p>
    </div>
    <UInput
      v-if="isEditing"
      v-model:model-value="state.companyData.id"
      required
      label="Código"
      size="xl"
      readonly
      placeholder="ID del Usuario"
      icon="i-heroicons-circle-stack"
      :ui="inputUI"
      :loading="state.isLoading" />
  </div>
  <br /> <br />
</template>