<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Sign up'
})

/*

        user_lastname: string;
*/
const fields = [
  {
    name: 'email',
    type: 'text',
    label: 'Email',
    placeholder: 'Ingrese su email',
  },
  {
    name: 'user_name',
    type: 'text',
    label: 'Nombres',
    placeholder: 'Ingrese sus nombres',
  },
  {
    name: 'user_lastname',
    type: 'text',
    label: 'Apellidos',
    placeholder: 'Ingrese sus apellidos',
  },
]

const validate = (state: any) => {
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Email is required' })
  if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
  return errors
}

function onSubmit (data: any) {
  console.log('Submitted', data)
}
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      align="top"
      title="Registrar cuenta"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ label: 'Registrar cuenta', trailingIcon: 'i-heroicons-user-plus' }"
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