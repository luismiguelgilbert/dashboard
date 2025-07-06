<script setup lang="ts">
import type { FormSubmitEvent, FormError } from '@nuxt/ui';

const password = reactive<Partial<PasswordSchema>>({
  new: undefined,
  confirm: undefined,
});
const isProcessing = ref(false);

const validate = (state: Partial<PasswordSchema>): FormError[] => {
  const errors: FormError[] = []
  if (state.confirm && state.new && state.confirm !== state.new) {
    errors.push({ name: 'new', message: 'Las contraseñas deben coincidir' })
  }
  return errors
}

const onSubmit = async (event: FormSubmitEvent<PasswordSchema>) => {
  try {
    const headers = useRequestHeaders(['cookie']);
    isProcessing.value = true;
    await $fetch('/api/system/userPasswordUpdate', {
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
  <UPageCard
    title="Contraseña"
    description="Ingrese y confirme su nueva contraseña."
    variant="subtle">
    <UForm
      :schema="passwordSchema"
      :state="password"
      :validate="validate"
      class="flex flex-col gap-4 max-w-xs"
      @submit="onSubmit">
      <UFormField name="current">
        <UInput
          v-model="password.new"
          size="xl"
          type="password"
          placeholder="Nueva contraseña"
          class="w-full" />
      </UFormField>

      <UFormField name="new">
        <UInput
          v-model="password.confirm"
          size="xl"
          type="password"
          placeholder="Confirmar contraseña"
          class="w-full" />
      </UFormField>

      <UButton
        class="w-fit cursor-pointer"
        type="submit"
        label="Cambiar contraseña"
        size="xl"
        :loading="isProcessing"
        :disabled="isProcessing" />
    </UForm>
  </UPageCard>
</template>
