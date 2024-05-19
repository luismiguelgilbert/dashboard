<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { companyDataForm } from '@/types/server/sys_companies';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  saving: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    required: false,
    default: false,
  }
});

const { state } = useSecurityCompaniesForm();
const isMobile = useBreakpoints(breakpointsTailwind).smaller('sm');
const inputSize = computed(() => isMobile.value ? 'lg' : 'xl');
const inputUI = { icon: { leading: { wrapper: 'content-start items-start pt-2.5' }, base: 'text-gray-400' } };
const fileRef = ref<{ input: HTMLInputElement }>();
const form = ref();

const onFileChange = (e: FileList) => {
  if (!e.length) { return; }
  if (e[0].size / 1024 / 1024 > 1) { return; }
  state.value.avatar = e[0];
  state.value.data.companyData.avatar_url = URL.createObjectURL(e[0]);
};

const onFileClick = () => { fileRef.value?.input.click(); };

watch(() => props.saving, (newValue) => { if (newValue) { form.value.validate(); } });
</script>

<template>
  <SkeletonHeader v-if="props.loading" />
  <div v-else>
    <UForm
      ref="form"
      class="pl-6 pr-6 md:pl-2 md:pr-2 pt-4 md:pt-0"
      :schema="companyDataForm"
      :state="state.data.companyData">
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
        <UFormGroup
          :size="inputSize"
          name="company_number">
          <UInput
            v-model:model-value="state.data.companyData.company_number"
            required
            placeholder="RUC de la organización"
            icon="i-heroicons-identification"
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
        <UFormGroup
          :size="inputSize"
          name="name_es_short">
          <UInput
            v-model:model-value="state.data.companyData.name_es_short"
            required
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
        <UFormGroup
          :size="inputSize"
          name="name_es">
          <UInput
            v-model:model-value="state.data.companyData.name_es"
            required
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
        <UFormGroup
          :size="inputSize"
          name="is_active">
          <UToggle
            v-model="state.data.companyData.is_active"
            :disabled="state.isLoading" />
          <span
            class="ml-5"
            style="vertical-align: text-bottom;">{{ state.data.companyData.is_active ? 'Activo' : 'Inactivo' }}</span>
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
        <UFormGroup
          :size="inputSize"
          name="avatar_url">
          <div class="flex items-center">
            <UAvatar
              :src="state.data.companyData.avatar_url!"
              :alt="state.data.companyData.name_es"
              size="lg" />
            <UButton
              label="Seleccionar"
              color="white"
              size="md"
              class="ml-5"
              @click="onFileClick" />
            <UInput
              ref="fileRef"
              type="file"
              class="hidden"
              accept=".jpg, .jpeg, .png, .gif"
              @change="onFileChange" />
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
        <UFormGroup
          :size="inputSize"
          name="billing_phone">
          <UInput
            v-model:model-value="state.data.companyData.billing_phone"
            required
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
        <UFormGroup
          :size="inputSize"
          name="billing_address">
          <UInput
            v-model:model-value="state.data.companyData.billing_address"
            required
            placeholder="Dirección"
            icon="i-heroicons-map-pin"
            :ui="inputUI"
            :loading="state.isLoading" />
        </UFormGroup>
        
        <UDivider
          v-if="isEditing"
          class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
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
          v-model:model-value="state.data.companyData.id"
          label="Código"
          :size="inputSize"
          readonly
          placeholder="ID del Usuario"
          icon="i-heroicons-circle-stack"
          :ui="inputUI"
          :loading="state.isLoading" />
      </div>
      <br /> <br />
    </UForm>
  </div>
</template>