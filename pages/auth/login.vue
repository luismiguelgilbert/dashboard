<script setup lang="ts">
import type { FormError, FormGroupSize } from '#ui/types';

useHead({ title: 'BITT - Ingreso' });

definePageMeta({
  layout: 'auth',
});
const loading = ref<boolean>(false);
const { start, finish } = useLoadingIndicator();

const sizeXL: FormGroupSize = 'xl';
const fields = [
  {
    name: 'email',
    type: 'text',
    label: 'Email',
    placeholder: 'Ingrese su email',
    color: 'gray',
    size: sizeXL,
  },
  {
    name: 'password',
    label: 'Clave',
    type: 'password',
    placeholder: 'Ingrese su clave',
    color: 'gray',
    size: sizeXL,
  }
];

const validate = (state: any) => {
  const errors: FormError[] = [];
  if (!state.email) errors.push({ path: 'email', message: 'Email es obligatorio' });
  if (!state.password) errors.push({ path: 'password', message: 'Password es obligatorio' });
  return errors;
};

const onSubmit = async (credentialData: any) => {
  try {
    start();
    loading.value = true;
    const credentials = ({
      email: credentialData.email,
      password: credentialData.password,
    });
    const { supabase } = useSupabase();
    const { data, error } = await supabase.auth.signInWithPassword(credentials, );
    if (error) throw error;
    
    document.cookie = `sb-access-token=${data.session.access_token}; path=/`;
    document.cookie = `sb-refresh-token=${data.session.refresh_token}; path=/`;
    loading.value = false;
    finish();
    await navigateTo('/');
  } catch(error: any) {
    finish();
    loading.value = false;
    console.error(error);
    const toast = useToast();
    toast.add({
      title: 'Error al iniciar sesión',
      color: 'rose',
      description: `${error.message}`,
    });
  }
};
</script>

<template>
  <div class="h-full sm:h-0 flex items-start sm:items-center backdrop-blur">
    <UCard class="w-dvw h-full sm:h-auto sm:w-96">
      <UAuthForm
        :fields="fields"
        align="top"
        title="Iniciar sesión"
        :loading="loading"
        :validate="validate"
        :ui="{ base: 'text-center', footer: 'text-center' }"
        :submit-button="{ label: 'Iniciar sesión', trailingIcon: 'i-heroicons-arrow-right-20-solid', size: 'xl' }"
        @submit="onSubmit"
      >
        <template #email-hint>
          <NuxtLink
            to="/auth/signup"
            class="text-primary font-medium">
            No tiene una cuenta?
          </NuxtLink>
        </template>
        <template #password-hint>
          <NuxtLink
            to="/auth/forgot"
            class="text-primary font-medium">
            Olvidó su clave?
          </NuxtLink>
        </template>
      </UAuthForm>
    </UCard>
  </div>
</template>