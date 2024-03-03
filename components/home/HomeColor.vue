<script setup lang="ts">
import { colors, darkColors } from './config';
const { sessionData } = useUserSession();
const appConfig = useAppConfig();
const colorMode = useColorMode();
const isUpdating = ref(false);
const hasError = ref(false);

const toggleTheme = async () => {
  if (sessionData.value.userData) {
    sessionData.value.userData.dark_enabled = !sessionData.value.userData?.dark_enabled;
    colorMode.preference = sessionData.value.userData?.dark_enabled ? 'dark' : 'light';
    isUpdating.value = true;
    const { error } = await useFetch(`/api/users/${sessionData.value.userData.id}/preferences`, {
      method: 'patch',
      body: { dark_enabled: sessionData.value.userData.dark_enabled },
    })
    isUpdating.value = false
    if (error.value ) { hasError.value = true }
  }
}

const setDarkColor = async () => {
  if (sessionData.value.userData) {
    appConfig.ui.gray = sessionData.value.userData?.default_dark_color;
    isUpdating.value = true
    const { error } = await useFetch(`/api/users/${sessionData.value.userData.id}/preferences`, {
      method: 'patch',
      body: { default_dark_color: sessionData.value.userData.default_dark_color },
    })
    isUpdating.value = false
    if (error.value ) { hasError.value = true }
  }
}

const setColor = async () => {
  if (sessionData.value.userData) {
    appConfig.ui.primary = sessionData.value.userData.default_color;
  
    isUpdating.value = true
    hasError.value = false
    const { error } = await useFetch(`/api/users/${sessionData.value.userData.id}/preferences`, {
      method: 'patch',
      body: { default_color: sessionData.value.userData.default_color },
    })
    isUpdating.value = false
    if (error.value ) { hasError.value = true }
  }
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-2 sm:px-4">
    <div class="col-span-1 sm:col-span-2 pt-1" />
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Tema:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Combinación de colores preferida.
      </p>
    </div>
    <UToggle
      :model-value="sessionData.userData?.dark_enabled"
      :disabled="isUpdating"
      @update:model-value="toggleTheme" />
    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Color de fondo:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Color de fondo para tema Oscuro (Dark).
      </p>
    </div>
    <USelectMenu
      v-if="sessionData.userData"
      v-model="sessionData.userData.default_dark_color"
      size="xl"
      :options="darkColors"
      :loading="isUpdating"
      @update:model-value="setDarkColor"
    />
    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Color:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Color de acentuación preferido.
      </p>
    </div>
    <USelectMenu
      v-if="sessionData.userData"
      v-model="sessionData.userData.default_color"
      size="xl"
      :options="colors"
      :loading="isUpdating"
      @update:model-value="setColor"
    />
  </div>
</template>