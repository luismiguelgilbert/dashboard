<script setup lang="ts">
const state = useUser()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-2 sm:px-4">
    <div class="col-span-1 sm:col-span-2 pt-1" />
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
      size="xl"
      type="text"
      name="email"
      aria-label="Email"
      icon="i-heroicons-envelope"
      readonly
      :loading="state.isLoadingUser"
    />
    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
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
      label="Nombres"
      size="xl"
      type="text"
      name="user_name"
      icon="i-heroicons-user"
      readonly
      :loading="state.isLoadingUser"
    />
    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
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
      label="Apellidos"
      size="xl"
      type="text"
      name="user_lastname"
      icon="i-heroicons-user"
      readonly
      :loading="state.isLoadingUser"
    />
    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
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
      label="Perfil"
      size="xl"
      type="text"
      name="sys_profile_name"
      icon="i-heroicons-user-circle"
      readonly
      :loading="state.isLoadingUser"
    />
    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
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
      required
      size="xl"
      type="text"
      name="id"
      label="Código"
      icon="i-heroicons-circle-stack"
      readonly
      :loading="state.isLoadingUser"
    />
    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
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
      label="Último Ingreso"
      size="xl"
      type="text"
      name="last_sign_in_at"
      icon="i-heroicons-arrow-right-end-on-rectangle"
      readonly
      :loading="state.isLoadingUser"
    />
    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
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
      label="Fecha de creación"
      size="xl"
      type="text"
      name="created_at"
      icon="i-heroicons-calendar"
      readonly
      :loading="state.isLoadingUser"
    />
    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
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
      label="Fecha de actualización"
      size="xl"
      type="text"
      name="updated_at"
      icon="i-heroicons-pencil-square"
      readonly
      :loading="state.isLoadingUser"
    />
    <div class="col-span-1 sm:col-span-2 pb-6" />
  </div>
</template>