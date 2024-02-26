<script setup lang="ts">
const state = useUser()
</script>

<template>
  <div class="divide-y divide-gray-200 dark:divide-gray-800 space-y-6 *:pt-6 first:*:pt-2 first:*:pt-0 mb-6 px-2 sm:px-4 ">
    <div class="mt-6 flex flex-row flex-wrap gap-4 justify-between content-between">
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Email:
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Cuenta de correo del usuario.
        </p>
      </div>
      <UInput
        :value="state.userData.email"
        class="flex-auto max-w-96"
        size="xl"
        type="text"
        name="email"
        aria-label="Email"
        icon="i-heroicons-envelope"
        readonly
        :loading="state.isLoadingUser"
      />
    </div>
    <div class="flex flex-row flex-wrap gap-4 justify-between content-between">
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Nombres:
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Nombres del usuario.
        </p>
      </div>
      <UInput
        :value="state.userData.user_name"
        class="flex-auto max-w-96"
        label="Nombres"
        size="xl"
        type="text"
        name="user_name"
        icon="i-heroicons-user"
        readonly
        :loading="state.isLoadingUser"
      />
    </div>
    <div class="flex flex-row flex-wrap gap-4 justify-between content-between">
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Apellidos:
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Apellidos del usuario.
        </p>
      </div>
      <UInput
        :value="state.userData.user_lastname"
        class="flex-auto max-w-96"
        label="Apellidos"
        size="xl"
        type="text"
        name="user_lastname"
        icon="i-heroicons-user"
        readonly
        :loading="state.isLoadingUser"
      />
    </div>
    <div class="flex flex-row flex-wrap gap-4 justify-between content-between">
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Perfil:
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Rol para controlar permisos.
        </p>
      </div>
      <UInput
        :value="state.userData.sys_profile_name"
        class="flex-auto max-w-96"
        label="Perfil"
        size="xl"
        type="text"
        name="sys_profile_name"
        icon="i-heroicons-user-circle"
        readonly
        :loading="state.isLoadingUser"
      />
    </div>
    <div class="flex flex-row flex-wrap gap-4 justify-between content-between">
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Código:
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Código usado por el sistema.
        </p>
      </div>
      <UInput
        :value="state.userData.id"
        class="flex-auto max-w-96"
        required
        size="xl"
        type="text"
        name="id"
        label="Código"
        icon="i-heroicons-circle-stack"
        readonly
        :loading="state.isLoadingUser"
      />
    </div>
    <div class="flex flex-row flex-wrap gap-4 justify-between content-between">
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Ingreso:
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Fecha y hora del último ingreso.
        </p>
      </div>
      <UInput
        :value="state.userData.last_sign_in_at"
        class="flex-auto max-w-96"
        label="Último Ingreso"
        size="xl"
        type="text"
        name="last_sign_in_at"
        icon="i-heroicons-arrow-right-end-on-rectangle"
        readonly
        :loading="state.isLoadingUser"
      />
    </div>
    <div class="flex flex-row flex-wrap gap-4 justify-between content-between">
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Desde:
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Fecha y hora de creación del usuario.
        </p>
      </div>
      <UInput
        :value="state.userData.created_at"
        class="flex-auto max-w-96"
        label="Fecha de creación"
        size="xl"
        type="text"
        name="created_at"
        icon="i-heroicons-calendar"
        readonly
        :loading="state.isLoadingUser"
      />
    </div>
    <div class="flex flex-row flex-wrap gap-4 justify-between content-between">
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">
          Actualización:
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Fecha y hora de última edición al usuario.
        </p>
      </div>
      <UInput
        :value="state.userData.updated_at"
        class="flex-auto max-w-96"
        label="Fecha de actualización"
        size="xl"
        type="text"
        name="updated_at"
        icon="i-heroicons-pencil-square"
        readonly
        :loading="state.isLoadingUser"
      />
    </div>
  </div>
</template>