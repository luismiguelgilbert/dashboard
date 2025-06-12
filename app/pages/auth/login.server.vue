<script setup lang="ts">
useHead({ title: 'BITT - Ingreso' });
definePageMeta({ layout: false });

const queryParams = useRoute().query;
</script>

<template>
  <div class="w-full sm:grid sm:grid-cols-2 sm:min-h-[calc(100dvh)] px-5 sm:px-0">
    <div class="flex items-center justify-center py-2 sm:py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">
            Ingreso
          </h1>
          <p class="hidden sm:block text-sm text-center text-neutral-600">
            Ingrese sus credencial para continuar
          </p>
        </div>
        <form
          class="grid gap-4"
          action="/api/system/authenticate"
          method="post">
          <div class="grid gap-2">
            <UFormField label="Email" name="email" size="xl">
              <UButtonGroup class="w-full">
                <UButton
                  color="neutral"
                  variant="subtle"
                  icon="i-lucide-at-sign" />
                <UInput
                  autofocus
                  required
                  placeholder="Ingrese su dirección de correo"
                  class="w-full"
                  size="xl" />
              </UButtonGroup>
            </UFormField>
          </div>
          <div class="grid gap-2">
            <UFormField label="Password" name="password">
              <UButtonGroup class="w-full">
                <UButton variant="subtle" icon="i-lucide-rectangle-ellipsis" />
                <UInput
                  autofocus
                  required
                  placeholder="Ingrese su contraseña"
                  class="w-full"
                  size="xl"
                  type="password" />
              </UButtonGroup>
            </UFormField>
          </div>

          <UButton size="xl" class="h-12 w-full mt-2 cursor-pointer justify-between" type="submit">
            Ingresar
            <UIcon name="i-lucide-log-in" class="text-2xl" />
          </UButton>
          <UAlert
            v-if="queryParams.session_error"
            variant="soft"
            color="error"
            description="No encontramos una sesión activa."
            icon="i-lucide-shield-x" />
          <UAlert
            v-if="queryParams.invalid"
            variant="soft"
            color="error"
            description="Credenciales incorrectas."
            icon="i-lucide-square-asterisk" />
          <UAlert
            v-if="queryParams.invalid_companies"
            variant="soft"
            color="error"
            description="Sin organizaciones asignadas."
            icon="i-lucide-square-asterisk" />
          <UAlert
            v-if="queryParams.invalid_companies"
            variant="soft"
            color="error"
            description="Sin permisos asignados."
            icon="i-lucide-square-asterisk" />
        </form>
      </div>
    </div>
    <div class="hidden bg-neutral-950 sm:flex items-center justify-center py-2 sm:py-12">
      <div class="flex items-center gap-x-2">
        <UIcon name="i-lucide-database-zap" class="text-9xl text-primary-400" />
        <div class="grid grid-cols-1">
          <span class="text-3xl font-bold text-center text-neutral-100">
            Framework
          </span>
          <span class="text-xl font-semibold text-center text-neutral-300">
            Business Intelligence
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
