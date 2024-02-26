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
  <div class="divide-y divide-gray-200 dark:divide-gray-800 space-y-6 *:pt-6 first:*:pt-2 first:*:pt-0 mb-6 px-2 sm:px-4 ">
    <div class="mt-6 flex flex-row flex-wrap gap-4 justify-between content-between">
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
        class="flex-auto max-w-96"
        size="xl"
        :options="state.themes"
        @update:model-value="setTheme"
      />
    </div>
    <div class="mt-6 flex flex-row flex-wrap gap-4 justify-between content-between">
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
        class="flex-auto max-w-96"
        size="xl"
        :options="state.darkColors"
        @update:model-value="setDarkColor"
      />
    </div>
    <div class="mt-6 flex flex-row flex-wrap gap-4 justify-between content-between">
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
        class="flex-auto max-w-96"
        size="xl"
        :options="state.colors"
        @update:model-value="setColor"
      />
    </div>
  </div>
</template>