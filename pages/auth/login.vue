<script setup lang="ts">
import { AuthError } from '@supabase/supabase-js'
import type { FormError } from '#ui/types'

useHead({ title: 'BITT - Ingreso' })

definePageMeta({
  layout: 'auth',
})
const supabase = useSupabaseClient()
const loading = ref<boolean>(false)
const loginError = ref<AuthError>(new AuthError('', 0))


const fields = [
  {
    name: 'email',
    type: 'text',
    label: 'Email',
    placeholder: 'Ingrese su email',
    color: 'gray'
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Ingrese su password',
    color: 'gray'
  }
]

const generateSBcookies = () => {
  try {
    //Generate sb-access-token cookie from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.includes('sb-') && key.includes('token')) {
        const supabaseStorageData = JSON.parse(localStorage[key])
        const supabaseAccessToken = supabaseStorageData.access_token
        supabaseAccessToken && createCookie('sb-access-token', supabaseAccessToken, 1)
      }
    })
    //Generate sb-refresh-token cookie from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.includes('sb-') && key.includes('token')) {
        const supabaseStorageData = JSON.parse(localStorage[key])
        const supabaseRefreshToken = supabaseStorageData.refresh_token
        supabaseRefreshToken && createCookie('sb-refresh-token', supabaseRefreshToken, 1)
      }
    })
  } catch(error) {
    loading.value = false
    console.error(error)
  }
}

const createCookie = (name: string, value: string, days: number) => {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + (days*24*60*60*1000))
    expires = `; expires=${date.toUTCString()}`
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/; samesite=strict;` //";secure" breaks local development
}

const validate = (state: any) => {
  const errors: FormError[] = []
  if (!state.email) errors.push({ path: 'email', message: 'Email es obligatorio' })
  if (!state.password) errors.push({ path: 'password', message: 'Password es obligatorio' })
  return errors
}

const onSubmit = async (data: any) => {
  try {
    loading.value = true
    const credentials = ({
      email: data.email,
      password: data.password,
    })
    const { error } = await supabase.auth.signInWithPassword(credentials)
    error && (loginError.value = error)
    if (!error) {
      await generateSBcookies()
      navigateTo('/auth/confirm')
    } else {
      loading.value = false
    }
  } catch(error) {
    loading.value = false
    console.error(error)
  }
}
</script>

<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      title="Bienvenido"
      align="top"
      icon="i-heroicons-lock-closed"
      :loading="loading"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ trailingIcon: 'i-heroicons-arrow-right-20-solid' }"
      @submit="onSubmit"
    >
      <template #password-hint>
        <NuxtLink to="/" class="text-primary font-medium">
          Olvidó su password?
        </NuxtLink>
      </template>
    </UAuthForm>
  </UCard>
</template>