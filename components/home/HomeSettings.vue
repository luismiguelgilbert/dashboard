<script setup lang="ts">
import { colors, darkColors } from './config';
const { sessionData } = useUserSession();
const toast = useToast();
const appConfig = useAppConfig();
const colorMode = useColorMode();
const isUpdating = ref(false);
const hasError = ref(false);
const fileRef = ref<{ input: HTMLInputElement }>();

const updateError = () => {
  toast.add({
    title: 'Error',
    description: 'No se guardaron los cambios. Inténtelo nuevamente.',
    icon: 'i-heroicons-no-symbol',
    color: 'rose',
    timeout: 2000,
  });
};

const toggleTheme = async () => {
  if (sessionData.value.userData?.id) {
    try {
      sessionData.value.userData.dark_enabled = !sessionData.value.userData?.dark_enabled;
      colorMode.preference = sessionData.value.userData?.dark_enabled ? 'dark' : 'light';
      isUpdating.value = true;
      hasError.value = false;
      await $fetch(`/api/security/users/:${sessionData.value.userData.id}/preferences`, {
        method: 'post',
        body: { dark_enabled: sessionData.value.userData.dark_enabled },
      });
      isUpdating.value = false;
    } catch(error) {
      isUpdating.value = false;
      updateError();
    }
  }
};

const setDarkColor = async () => {
  if (sessionData.value.userData?.id) {
    try{
      appConfig.ui.gray = sessionData.value.userData?.default_dark_color ?? 'zinc';
      isUpdating.value = true;
      hasError.value = false;
      await $fetch(`/api/security/users/:${sessionData.value.userData.id}/preferences`, {
        method: 'post',
        body: { default_dark_color: sessionData.value.userData.default_dark_color },
      });
      isUpdating.value = false;
    } catch(error) {
      isUpdating.value = false;
      updateError();
    }
  }
};

const setColor = async () => {
  if (sessionData.value.userData?.id) {
    try {
      appConfig.ui.primary = sessionData.value.userData.default_color ?? 'indigo';
      isUpdating.value = true;
      hasError.value = false;
      await $fetch(`/api/security/users/:${sessionData.value.userData.id}/preferences`, {
        method: 'post',
        body: { default_color: sessionData.value.userData.default_color },
      });
      isUpdating.value = false;
    } catch(error) {
      isUpdating.value = false;
      updateError();
    }
  }
};

const setPreferedCompany = async () => {
  if (sessionData.value.userData?.id) {
    try {
      isUpdating.value = true;
      hasError.value = false;
      await $fetch(`/api/security/users/:${sessionData.value.userData.id}/preferences`, {
        method: 'post',
        body: { prefered_company_id: sessionData.value.userData.prefered_company_id },
      });
      isUpdating.value = false;
    } catch(error) {
      isUpdating.value = false;
      updateError();
    }
  }
};

const onFileChange = async (e: FileList) => {
  if (sessionData.value.userData) {
    try {
      isUpdating.value = true;
      if (!e.length) { return; }
      if (e[0].size / 1024 / 1024 > 1) { return; }
      sessionData.value.userData.avatar_url = URL.createObjectURL(e[0]);
  
      const body = new FormData();
      body.append('file', e[0]);
      await $fetch(`/api/security/users/:${sessionData.value.userData.id}/avatar`, {
        method: 'patch',
        body,
      });
      isUpdating.value = false;
    } catch(error) {
      isUpdating.value = false;
      updateError();
    }
  }
};

const onFileClick = () => { fileRef.value?.input.click(); };
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-2 sm:px-4">
    <div class="col-span-1 sm:col-span-2 pt-1" />
    
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Organización predeterminada:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Organización predeterminada al iniciar sesión.
      </p>
    </div>
    <USelectMenu
      v-if="sessionData.userData"
      v-model="sessionData.userData.prefered_company_id"
      size="xl"
      icon="i-heroicons-home-modern"
      :options="sessionData.userCompanies ?? []"
      :loading="isUpdating"
      option-attribute="name_es_short"
      value-attribute="id"
      @update:model-value="setPreferedCompany"
    />

    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Avatar:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Mi foto de perfil (1MB max).
      </p>
    </div>
    <UFormGroup name="sys_profile_id">
      <div class="flex items-center">
        <UAvatar
          v-if="sessionData.userData?.avatar_url"
          :src="sessionData.userData?.avatar_url!"
          :alt="sessionData.userData?.avatar_url"
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
        Activar tema oscuro:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Utilizar fondo oscuro.
      </p>
    </div>
    <UToggle
      :model-value="sessionData.userData?.dark_enabled"
      :disabled="isUpdating"
      @update:model-value="toggleTheme" />

    <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
    <div>
      <p class="text-gray-900 dark:text-white font-semibold">
        Tonalidad de fondo oscuro:
      </p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Al activar el fondo oscuro, se usará el tono seleccionado.
      </p>
    </div>
    <USelectMenu
      v-if="sessionData.userData"
      v-model="sessionData.userData.default_dark_color"
      size="xl"
      icon="i-heroicons-moon"
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
      icon="i-heroicons-swatch"
      :options="colors"
      :loading="isUpdating"
      @update:model-value="setColor"
    />
  </div>
</template>