<script setup lang="ts">
import imageCompression from 'browser-image-compression';
import type { FormSubmitEvent } from '@nuxt/ui';
import type { container } from '#build/ui';

const userSession = await useUserSession();
const isProcessing = ref(false);
const fileRef = ref<HTMLInputElement>()
const profile = reactive<Partial<ProfileSchema>>({
  user_name: userSession.user.value?.user_name,
  user_lastname: userSession.user.value?.user_lastname,
  email: userSession.user.value?.email,
  avatar: userSession.user.value?.avatar_url,
  avatar_file: undefined,
})
const onFileClick = () => fileRef.value?.click();
const onFileChange = async (e: Event) => {
  try {
    isProcessing.value = true;
    const inputElement: HTMLInputElement = e.target as HTMLInputElement;
    if (!(inputElement).files?.length) {
      throw new Error('No se seleccionó archivo.');
    }
    if (inputElement.files[0]) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: false,
      };
      try {
        const compressedFile = await imageCompression(inputElement.files[0], options);

        if (compressedFile.size / 1024 / 1024 > 1) {
          throw new Error('Tamaño incorrecto.');
        }
        if (compressedFile) {
          profile.avatar_file = await filetoBase64(compressedFile);
          profile.avatar = URL.createObjectURL(compressedFile);
        }
      } catch (error) {
        console.error(error);
        useToast().add({
          title: `Error al cargar archivo: ${error}`,
          icon: 'i-hugeicons-settings-error-01',
          color: 'error',
        });
      }
    }
    isProcessing.value = false;
  } catch (error) {
    isProcessing.value = false;
    useToast().add({
      title: `Error al cargar archivo: ${error}`,
      icon: 'i-hugeicons-settings-error-01',
      color: 'error',
    });
  }
}

const onSubmit = async (event: FormSubmitEvent<ProfileSchema>) => {
  try {
    const headers = useRequestHeaders(['cookie']);
    isProcessing.value = true;
    await $fetch('/api/system/userUpdate', {
      method: 'post',
      body: event.data,
      headers,
    })
    useToast().add({
      title: 'Listo',
      description: 'Sus cambios fueron guardados.',
      icon: 'i-lucide-check',
      color: 'success'
    })
  } catch (error) {
    useToast().add({
      title: 'Error',
      description: `Error al guardar los cambios. (${error})`,
      icon: 'i-lucide-shield-alert',
      type: 'foreground',
      color: 'error',
    });
    console.error(error);
  } finally {
    isProcessing.value = false;
  }
}
</script>

<template>
  <UForm
    id="settings"
    :schema="profileSchema"
    :state="profile"
    @submit="onSubmit">
    <UPageCard
      title="Mis Datos"
      description="Información pública del usuario."
      variant="naked"
      orientation="horizontal"
      class="mb-4">
      <UButton
        form="settings"
        label="Guardar cambios"
        color="primary"
        type="submit"
        class="w-fit lg:ms-auto cursor-pointer"
        size="xl"
        :loading="isProcessing"
        :disabled="isProcessing" />
    </UPageCard>

    <UPageCard variant="subtle" :ui="{ container: 'relative flex flex-col flex-1 lg:grid gap-x-8 gap-y-4 sm:p-6 px-0' }">
      <UFormField
        name="user_name"
        label="Nombres"
        description="Aparece en reportes y notificaciones del sistema."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4 pl-2">
        <UInput
          v-model="profile.user_name"
          class="min-w-64"
          size="xl"
          autocomplete="off" />
      </UFormField>
      <USeparator />
      <UFormField
        name="user_lastname"
        label="Apellidos"
        description="Aparece en reportes y notificaciones del sistema."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4 pl-2">
        <UInput
          v-model="profile.user_lastname"
          class="min-w-64"
          size="xl"
          autocomplete="off" />
      </UFormField>
      <USeparator />
      <UFormField
        name="email"
        label="Email"
        description="Usado al iniciar sesión."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4 pl-2">
        <UInput
          v-model="profile.email"
          class="min-w-64"
          type="email"
          size="xl"
          autocomplete="off"
          readonly />
      </UFormField>
      <USeparator />
      <UFormField
        name="avatar"
        label="Avatar"
        description="JPG, GIF or PNG. 1MB Max."
        class="flex max-sm:flex-col justify-between items-start gap-4 pl-2">
        <div class="flex flex-wrap items-center gap-3">
          <UAvatar
            :src="profile.avatar"
            :alt="profile.user_name"
            size="lg" />
          <UButton
            label="Seleccionar"
            color="neutral"
            @click="onFileClick" />
          <input
            ref="fileRef"
            type="file"
            class="hidden"
            accept=".jpg, .jpeg, .png, .gif"
            @change="onFileChange">
        </div>
      </UFormField>
    </UPageCard>
  </UForm>
</template>
