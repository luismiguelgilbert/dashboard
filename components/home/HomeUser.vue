<script setup lang="ts">
const { sessionData } = useUserSession();
const { supabase } = useSupabase();
const { start, finish } = useLoadingIndicator();

const logout = async () => {
  start();
  await supabase.auth.signOut();
  document.cookie.split(';').forEach((c) => {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });
  await navigateTo('/auth/login');
  //Reset state
  sessionData.value.userData = null;
  sessionData.value.userCompanies = null;
  sessionData.value.userMenuData = null;
  finish();
};
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
      :value="sessionData.userData?.email"
      size="xl"
      type="text"
      name="email"
      aria-label="Email"
      icon="i-heroicons-envelope"
      readonly
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
      :value="sessionData.userData?.user_name"
      label="Nombres"
      size="xl"
      type="text"
      name="user_name"
      icon="i-heroicons-user"
      readonly
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
      :value="sessionData.userData?.user_lastname"
      label="Apellidos"
      size="xl"
      type="text"
      name="user_lastname"
      icon="i-heroicons-user"
      readonly
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
      :value="sessionData.userData?.sys_profile_name"
      label="Perfil"
      size="xl"
      type="text"
      name="sys_profile_name"
      icon="i-heroicons-user-circle"
      readonly
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
      :value="sessionData.userData?.id"
      required
      size="xl"
      type="text"
      name="id"
      label="Código"
      icon="i-heroicons-circle-stack"
      readonly
    />

    <UAlert
      class="col-span-1 sm:col-span-2 my-5 sm:my-0 mt-5"
      :actions="[{ variant: 'link', color: 'white', icon: 'i-hugeicons-logout-04', label: 'Salir', click: () => logout() }]"
      color="rose"
      title="Cerrar Sesión <br/><i class='font-thin'>Limpia datos de sesión en este dispositivo y cierra sesión</i>">
      <template #title="{ title }">
        <span v-html="title" />
      </template>
    </UAlert>
  </div>
</template>
