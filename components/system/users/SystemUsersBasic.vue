<script setup lang="ts">
import { type type_sys_profiles } from '@/types/server/sys_profiles';

const { isLoading, userData, profileOptions } = useSecurityUsersForm();
const inputUI = { icon: { leading: { wrapper: 'content-start items-start pt-2.5' }, base: 'text-gray-400' } };

const { data: profileOptionsData } = await useFetch<type_sys_profiles[]>('/api/lookups/sys_profiles');
profileOptions.value = profileOptionsData.value ?? [];

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
    <UInput
      v-model:model-value="userData.email"
      required
      size="xl"
      placeholder="Email del Usuario"
      icon="i-heroicons-envelope"
      :ui="inputUI"
      :loading="isLoading" />
    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />

    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Nombres:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Nombres del usuario.
      </p>
    </div>
    <UInput
      v-model:model-value="userData.user_name"
      required
      size="xl"
      placeholder="Nombres del Usuario"
      icon="i-heroicons-user"
      :ui="inputUI"
      :loading="isLoading" />
    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />

    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Apellidos:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Apellidos del usuarios.
      </p>
    </div>
    <UInput
      v-model:model-value="userData.user_lastname"
      required
      size="xl"
      placeholder="Apellidos del Usuario"
      icon="i-heroicons-user"
      :ui="inputUI"
      :loading="isLoading" />
    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />

    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Rol:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Define acceso a funcionalidades.
      </p>
    </div>
    <USelectMenu
      v-model="userData.sys_profile_id"
      searchable
      :loading="isLoading"
      searchable-placeholder="Buscar rol..."
      size="xl"
      icon="i-heroicons-user-circle"
      value-attribute="id"
      option-attribute="name_es"
      :options="profileOptions" />
    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />

    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Código:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Código reservado para uso del sistema.
      </p>
    </div>
    <UInput
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
</template>