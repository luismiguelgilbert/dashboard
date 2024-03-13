<script setup lang="ts">
import type { FormError, FormGroupSize } from '#ui/types'

useHead({ title: 'BITT - Ingreso' })

definePageMeta({
  layout: 'auth',
})

const loading = ref<boolean>(false)

const sizeXL: FormGroupSize = 'xl';
const fields = [
  {
    name: 'email',
    type: 'text',
    label: 'Email',
    placeholder: 'Ingrese su email',
    color: 'gray',
    size: sizeXL,
  }
]

const validate = (state: any) => {
  const errors: FormError[] = []
  if (!state.email) errors.push({ path: 'email', message: 'Email es obligatorio' })
  return errors
}

const onSubmit = async (data: any) => {
  console.info('onSubmit')
  console.info(data)
}
</script>

<template>
  <div class="h-full sm:h-0 flex items-start sm:items-center backdrop-blur">
    <UCard class="w-dvw h-full sm:h-auto sm:w-96">
      <UAuthForm
        :fields="fields"
        :validate="validate"
        title="Enviar correo de recuperación"
        align="top"
        icon="i-heroicons-envelope"
        :loading="loading"
        :ui="{ base: 'text-center', footer: 'text-center' }"
        :submit-button="{ label: 'Enviar correo', trailingIcon: 'i-heroicons-envelope', size: 'xl' }"
        @submit="onSubmit"
      >
        <template #email-hint>
          <NuxtLink to="/auth/login" class="text-primary font-medium">
            Regresar al inicio de sesión
          </NuxtLink>
        </template>
      </UAuthForm>
    </UCard>
  </div>
</template>