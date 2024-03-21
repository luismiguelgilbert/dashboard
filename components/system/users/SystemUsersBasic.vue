<script setup lang="ts">
import { colors, darkColors } from '@/components/home/config';
import { type type_sys_profiles } from '@/types/server/sys_profiles';

defineProps({
  isEditing: {
    type: Boolean,
    required: false,
    default: false,
  }
})

const { state } = useSecurityUsersForm();
const inputUI = { icon: { leading: { wrapper: 'content-start items-start pt-2.5' }, base: 'text-gray-400' } };
const fileRef = ref<{ input: HTMLInputElement }>();

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) { return }
  if (input.files[0].size / 1024 / 1024 > 1) { return }
  state.value.avatar = input.files[0];
  state.value.userData.avatar_url = URL.createObjectURL(input.files[0]);
};

const onFileClick = () => { fileRef.value?.input.click() };

//LOOKUP DATA
if (!state.value.profileOptions.length) {
  const { data: profileOptionsData } = await useFetch<type_sys_profiles[]>('/api/lookups/sys_profiles');
  state.value.profileOptions = profileOptionsData.value ?? [];
}
</script>

<template>
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
        v-model:model-value="state.userData.email"
        size="xl"
        placeholder="Email del Usuario"
        icon="i-heroicons-envelope"
        error
        :disabled="isEditing"
        :ui="inputUI"
        :loading="state.isLoading" />
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
        v-model:model-value="state.userData.user_name"
        required
        size="xl"
        placeholder="Nombres del Usuario"
        icon="i-heroicons-user"
        :ui="inputUI"
        :loading="state.isLoading" />
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
        v-model:model-value="state.userData.user_lastname"
        required
        size="xl"
        placeholder="Apellidos del Usuario"
        icon="i-heroicons-user"
        :ui="inputUI"
        :loading="state.isLoading" />
    </UFormGroup>

    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Sexo:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Sexo del usuario.
      </p>
    </div>
    <UFormGroup name="user_sex">
      <UToggle
        v-model="state.userData.user_sex"
        :disabled="state.isLoading" />
      <span class="ml-5" style="vertical-align: text-bottom;">{{ state.userData.user_sex ? 'Hombre' : 'Mujer' }}</span>
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
        v-model="state.userData.sys_profile_id"
        searchable
        :loading="state.isLoading"
        searchable-placeholder="Buscar rol..."
        placeholder="Seleccionar rol..."
        size="xl"
        icon="i-heroicons-user-circle"
        value-attribute="id"
        option-attribute="name_es"
        :options="state.profileOptions" />
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
        <UAvatar :src="state.userData.avatar_url!" :alt="state.userData.user_lastname" size="lg" />
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
        v-model="state.userData.dark_enabled"
        on-icon="i-heroicons-moon"
        off-icon="i-heroicons-sun"
        :disabled="state.isLoading" />
      <span class="ml-5" style="vertical-align: text-bottom;">{{ state.userData.dark_enabled ? 'Oscuro' : 'Claro' }}</span>
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
        v-model="state.userData.default_dark_color"
        size="xl"
        icon="i-heroicons-moon"
        :options="darkColors"
        :loading="state.isLoading"/>
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
        v-model="state.userData.default_color"
        size="xl"
        icon="i-heroicons-swatch"
        :options="colors"
        :loading="state.isLoading"/>
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
      v-model:model-value="state.userData.id"
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