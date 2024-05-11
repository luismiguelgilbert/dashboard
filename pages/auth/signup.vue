<script setup lang="ts">
import type { FormGroupSize } from '#ui/types';
definePageMeta({
  layout: 'auth'
});

useSeoMeta({
  title: 'Sign up'
});

const sizeXL: FormGroupSize = 'xl';
const fields = [
  {
    name: 'email',
    type: 'text',
    label: 'Email',
    placeholder: 'Ingrese su email',
    size: sizeXL,
  },
  {
    name: 'user_name',
    type: 'text',
    label: 'Nombres',
    placeholder: 'Ingrese sus nombres',
    size: sizeXL,
  },
  {
    name: 'user_lastname',
    type: 'text',
    label: 'Apellidos',
    placeholder: 'Ingrese sus apellidos',
    size: sizeXL,
  },
];

const validate = (state: any) => {
  const errors = [];
  if (!state.email) errors.push({ path: 'email', message: 'Email is required' });
  if (!state.password) errors.push({ path: 'password', message: 'Password is required' });
  return errors;
};

function onSubmit (data: any) {
  console.info('Submitted', data);
}
</script>

<template>
  <div class="h-full sm:h-0 flex items-start sm:items-center backdrop-blur">
    <UCard class="w-dvw h-full sm:h-auto sm:w-96">
      <UAuthForm
        :fields="fields"
        :validate="validate"
        align="top"
        title="Registrar cuenta"
        :ui="{ base: 'text-center', footer: 'text-center' }"
        :submit-button="{ label: 'Registrar cuenta', trailingIcon: 'i-heroicons-user-plus', size: 'xl' }"
        @submit="onSubmit"
      >
        <template #email-hint>
          <NuxtLink
            to="/auth/login"
            class="text-primary font-medium">
            Regresar al inicio de sesión
          </NuxtLink>
        </template>
      </UAuthForm>
    </UCard>
  </div>
</template>