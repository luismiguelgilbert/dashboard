<script setup lang="ts">
const state = useUser()
const appConfig = useAppConfig()
const colorMode = useColorMode()
const isUpdating = ref(false)
const hasError = ref(false)

const setTheme = async () => {
  colorMode.preference = state.value.theme
  isUpdating.value = true
  const { error } = await useFetch(`/api/users/${state.value.userData.id}/preferences`, {
    method: 'patch',
    body: { dark_enabled: state.value.theme === 'dark' },
  })
  isUpdating.value = false
  if (error.value ) { hasError.value = true }
}

const setDarkColor = async () => {
  appConfig.ui.gray = state.value.preferedDarkColor
  isUpdating.value = true
  const { error } = await useFetch(`/api/users/${state.value.userData.id}/preferences`, {
    method: 'patch',
    body: { default_dark_color: state.value.preferedDarkColor },
  })
  isUpdating.value = false
  if (error.value ) { hasError.value = true }
}

const setColor = async () => {
  appConfig.ui.primary = state.value.preferedColor

  isUpdating.value = true
  hasError.value = false
  const { error } = await useFetch(`/api/users/${state.value.userData.id}/preferences`, {
    method: 'patch',
    body: { default_color: state.value.preferedColor },
  })
  isUpdating.value = false
  if (error.value ) { hasError.value = true }
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
    <USelectMenu
      v-model="state.theme"
      size="xl"
      :options="state.themes"
      @update:model-value="setTheme"
    />
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
      v-model="state.preferedDarkColor"
      size="xl"
      :options="state.darkColors"
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
      v-model="state.preferedColor"
      size="xl"
      :options="state.colors"
      @update:model-value="setColor"
    />
  </div>
</template>