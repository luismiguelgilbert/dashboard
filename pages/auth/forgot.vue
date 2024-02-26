<script setup lang="ts">
import type { FormError } from '#ui/types'

useHead({ title: 'BITT - Ingreso' })

definePageMeta({
  layout: 'auth',
})

const loading = ref<boolean>(false)


const fields = [
  {
    name: 'email',
    type: 'text',
    label: 'Email',
    placeholder: 'Ingrese su email',
    color: 'gray'
  }
]

const validate = (state: any) => {
  const errors: FormError[] = []
  if (!state.email) errors.push({ path: 'email', message: 'Email es obligatorio' })
  return errors
}

const onSubmit = async (data: any) => {
  console.log('onSubmit')
  console.log(data)
}
</script>

<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      title="Enviar correo de recuperación"
      align="top"
      icon="i-heroicons-envelope"
      :loading="loading"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ label: 'Enviar correo', trailingIcon: 'i-heroicons-envelope' }"
      @submit="onSubmit"
    >
      <template #email-hint>
        <NuxtLink to="/auth/login" class="text-primary font-medium">
          Regresar al inicio de sesión
        </NuxtLink>
      </template>
    </UAuthForm>
  </UCard>
</template>