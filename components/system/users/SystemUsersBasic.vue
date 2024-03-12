<script setup lang="ts">
import { colors, darkColors } from '@/components/home/config';
import type { Form } from '#ui/types'
import { userDataForm, type type_userDataForm } from '@/types/server/sys_users';
import { type type_sys_profiles } from '@/types/server/sys_profiles';

defineProps({
  isEditing: {
    type: Boolean,
    required: false,
    default: false,
  }
})

const { isLoading, userData, avatar, profileOptions } = useSecurityUsersForm();
const inputUI = { icon: { leading: { wrapper: 'content-start items-start pt-2.5' }, base: 'text-gray-400' } };
const mainForm = ref<Form<type_userDataForm>>();
const fileRef = ref<{ input: HTMLInputElement }>();

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) { return }
  if (input.files[0].size / 1024 / 1024 > 1) { return }
  avatar.value = input.files[0];
  userData.value.avatar_url = URL.createObjectURL(input.files[0]);
}

const onFileClick = () => { fileRef.value?.input.click() }

const validateForm = async() => {
  try {
    await mainForm.value?.validate();
    return false;
  }catch(error) {
    console.error('Error validating form', error);
    return true;
  }
};
defineExpose({ validateForm });

const { data: profileOptionsData } = await useFetch<type_sys_profiles[]>('/api/lookups/sys_profiles');
profileOptions.value = profileOptionsData.value ?? [];
</script>

<template>
  <UForm ref="mainForm" :state="userData" :schema="userDataForm">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-2 sm:px-4 content-start">
      <div class="col-span-1 sm:col-span-2 pt-1" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Email:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Correo electrónico (requerido en el inicio de sesión).
        </p>
      </div>
      <UFormGroup name="email">
        <UInput
          v-model:model-value="userData.email"
          size="xl"
          placeholder="Email del Usuario error?"
          icon="i-heroicons-envelope"
          error
          :ui="inputUI"
          :loading="isLoading" />
      </UFormGroup>
      
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Nombres:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Nombres del usuario.
        </p>
      </div>
      <UFormGroup name="user_name">
        <UInput
          v-model:model-value="userData.user_name"
          required
          size="xl"
          placeholder="Nombres del Usuario"
          icon="i-heroicons-user"
          :ui="inputUI"
          :loading="isLoading" />
      </UFormGroup>
      
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Apellidos:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Apellidos del usuarios.
        </p>
      </div>
      <UFormGroup name="user_lastname">
        <UInput
          v-model:model-value="userData.user_lastname"
          required
          size="xl"
          placeholder="Apellidos del Usuario"
          icon="i-heroicons-user"
          :ui="inputUI"
          :loading="isLoading" />
      </UFormGroup>
      
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Rol:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Define acceso a funcionalidades.
        </p>
      </div>
      <UFormGroup name="sys_profile_id">
        <USelectMenu
          v-model="userData.sys_profile_id"
          searchable
          :loading="isLoading"
          searchable-placeholder="Buscar rol..."
          placeholder="Seleccionar rol..."
          size="xl"
          icon="i-heroicons-user-circle"
          value-attribute="id"
          option-attribute="name_es"
          :options="profileOptions" />
      </UFormGroup>
      
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Avatar:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Foto del usuario (1MB max).
        </p>
      </div>
      <UFormGroup name="sys_profile_id">
        <div class="flex items-center">
          <UAvatar :src="userData.avatar_url" :alt="userData.user_lastname" size="lg" />
          <UButton label="Seleccionar" color="white" size="md" @click="onFileClick" class="ml-5" />
          <UInput ref="fileRef" type="file" class="hidden" accept=".jpg, .jpeg, .png, .gif" @change="onFileChange" />
        </div>
      </UFormGroup>
      
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Tema oscuro::
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Utilizar fondo oscuro.
        </p>
      </div>
      <UFormGroup name="dark_enabled">
        <UToggle
          v-model="userData.dark_enabled"
          :disabled="isLoading" />
      </UFormGroup>
      
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Tonalidad de fondo oscuro:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Al activar el fondo oscuro, se usará el tono seleccionado.
        </p>
      </div>
      <UFormGroup name="default_dark_color">
        <USelectMenu
          v-model="userData.default_dark_color"
          size="xl"
          :options="darkColors"
          :loading="isLoading"/>
      </UFormGroup>
      
      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Color:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Color de acentuación preferido.
        </p>
      </div>
      <UFormGroup name="default_dark_color">
        <USelectMenu
          v-model="userData.default_color"
          size="xl"
          :options="colors"
          :loading="isLoading"/>
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
        v-model:model-value="userData.id"
        required
        label="Código"
        size="xl"
        readonly
        placeholder="ID del Usuario"
        icon="i-heroicons-circle-stack"
        :ui="inputUI"
        :loading="isLoading" />
    </div>
    <br /> <br />
  </UForm>
</template>