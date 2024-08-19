<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { sys_users } from '@/types/server/security/sys_users';
import { colors, darkColors } from '@/components/home/config';

const { state } = useSecurityUsersForm();
const isMobile = useBreakpoints(breakpointsTailwind).smaller('sm');
const inputSize = computed(() => isMobile.value ? 'lg' : 'xl');
const inputUI = { icon: { leading: { wrapper: 'content-start items-start pt-2.5' }, base: 'text-gray-400' } };
const fileRef = ref<{ input: HTMLInputElement }>();
const form = ref();

const { data: profileOptions, pending: profileOptionsPending } = await useLazyFetch('/api/lookups/security/sys_profiles');

const onFileChange = (e: FileList) => {
  if (!e.length) { return; }
  if (e[0].size / 1024 / 1024 > 1) { return; }
  if (state.value.data) {
    state.value.avatar = e[0];
    state.value.data.avatar_url = URL.createObjectURL(e[0]);
  }
};

const onFileClick = () => { fileRef.value?.input.click(); };

//Required to update Algolia indice
const updateSysProfileName = () => {
  if (state.value.data) {
    const sysProfileName = profileOptions.value?.find(x => x.id === state.value.data?.sys_profile_id)?.name_es;
    state.value.data.sys_profile_name = sysProfileName;
  }
};

watch([state.value], ([newState]) => newState.isSaving && form.value?.validate());
</script>

<template>
  <UForm
    v-if="state.data"
    ref="form"
    class="pl-6 pr-6 md:pl-2 md:pr-2 pt-4 md:pt-0"
    :schema="sys_users"
    :state="state.data">
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
      <UFormGroup
        :size="inputSize"
        name="email">
        <UInput
          v-model:model-value="state.data.email"
          required
          placeholder="Email del Usuario"
          icon="i-heroicons-envelope"
          :disabled="!!state.data.id"
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
      <UFormGroup
        :size="inputSize"
        name="user_name">
        <UInput
          v-model:model-value="state.data.user_name"
          required
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
      <UFormGroup
        :size="inputSize"
        name="user_lastname">
        <UInput
          v-model:model-value="state.data.user_lastname"
          required
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
      <UFormGroup
        :size="inputSize"
        name="user_sex">
        <UToggle
          v-model="state.data.user_sex"
          :disabled="state.isLoading" />
        <span
          class="ml-5"
          style="vertical-align: text-bottom;">{{ state.data.user_sex ? 'Hombre' : 'Mujer' }}</span>
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
      <UFormGroup
        :size="inputSize"
        name="sys_profile_id">
        <USelectMenu
          v-model="state.data.sys_profile_id"
          searchable
          required
          :loading="profileOptionsPending"
          searchable-placeholder="Buscar rol..."
          placeholder="Seleccionar rol..."
          icon="i-heroicons-user-circle"
          value-attribute="id"
          option-attribute="name_es"
          :options="profileOptions ?? []"
          @update:model-value="updateSysProfileName" />
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
      <UFormGroup
        :size="inputSize"
        name="avatar_url">
        <div class="flex items-center">
          <UAvatar
            :src="state.data.avatar_url!"
            :alt="state.data.user_lastname"
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
          Tema oscuro::
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Utilizar fondo oscuro.
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="dark_enabled">
        <UToggle
          v-model="state.data.dark_enabled"
          on-icon="i-heroicons-moon"
          off-icon="i-heroicons-sun"
          :disabled="state.isLoading" />
        <span
          class="ml-5"
          style="vertical-align: text-bottom;">{{ state.data.dark_enabled ? 'Oscuro' : 'Claro' }}</span>
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
      <UFormGroup
        :size="inputSize"
        name="default_dark_color">
        <USelectMenu
          v-model="state.data.default_dark_color"
          icon="i-heroicons-moon"
          :options="darkColors"
          :loading="state.isLoading" />
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
      <UFormGroup
        :size="inputSize"
        name="default_dark_color">
        <USelectMenu
          v-model="state.data.default_color"
          icon="i-heroicons-swatch"
          :options="colors"
          :loading="state.isLoading" />
      </UFormGroup>
      
      <UDivider
        v-if="state.data.id"
        class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div v-if="state.data.id">
        <p class="text-gray-900 dark:text-white font-semibold">
          Código:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Código reservado para uso del sistema.
        </p>
      </div>
      <UInput
        v-if="state.data.id"
        v-model:model-value="state.data.id"
        required
        label="Código"
        :size="inputSize"
        readonly
        placeholder="ID del Usuario"
        icon="i-heroicons-circle-stack"
        :ui="inputUI"
        :loading="state.isLoading" />
      <br /><br />
    </div>
  </UForm>
</template>