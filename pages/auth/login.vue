<script setup lang="ts">
import { AuthError } from '@supabase/supabase-js';
import type { FormError, FormGroupSize } from '#ui/types';

useHead({ title: 'BITT - Ingreso' });

definePageMeta({
  layout: 'auth',
});
const supabase = useSupabaseClient();
const loading = ref<boolean>(false);
const loginError = ref<AuthError>(new AuthError('', 0));

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

const generateSBcookies = () => {
  try {
    //Generate sb-access-token cookie from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.includes('sb-') && key.includes('token')) {
        const supabaseStorageData = JSON.parse(localStorage[key]);
        const supabaseAccessToken = supabaseStorageData.access_token;
        supabaseAccessToken && createCookie('sb-access-token', supabaseAccessToken, 1);
      }
    });
    //Generate sb-refresh-token cookie from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.includes('sb-') && key.includes('token')) {
        const supabaseStorageData = JSON.parse(localStorage[key]);
        const supabaseRefreshToken = supabaseStorageData.refresh_token;
        supabaseRefreshToken && createCookie('sb-refresh-token', supabaseRefreshToken, 1);
      }
    });
  } catch(error) {
    loading.value = false;
    console.error(error);
  }
};

const createCookie = (name: string, value: string, days: number) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/; samesite=strict;`; //";secure" breaks local development
};

const validate = (state: any) => {
  const errors: FormError[] = [];
  if (!state.email) errors.push({ path: 'email', message: 'Email es obligatorio' });
  if (!state.password) errors.push({ path: 'password', message: 'Password es obligatorio' });
  return errors;
};

const onSubmit = async (data: any) => {
  try {
    loading.value = true;
    const credentials = ({
      email: data.email,
      password: data.password,
    });
    const { error } = await supabase.auth.signInWithPassword(credentials);
    error && (loginError.value = error);
    if (!error) {
      await generateSBcookies();
      await navigateTo('/auth/confirm');
    } else {
      loading.value = false;
    }
  } catch(error) {
    loading.value = false;
    console.error(error);
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