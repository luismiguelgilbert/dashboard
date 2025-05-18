// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui-pro',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    '@vueuse/nuxt',
    'nuxt-auth-utils'
  ],
  pages: {
    pattern: [
      '**/*.vue',
      '!**/components/**'
    ]
  },
  components: [
    '~/components',
    {
      path: '~/pages',
      pattern: '**/components/**',
      pathPrefix: false
    }
  ],
  devtools: {
    enabled: true
  },
  css: ['~/assets/css/main.css'],
  routeRules: {
    '/api/**': {
      cors: true
    }
  },
  future: { compatibilityVersion: 4 },
  experimental: { componentIslands: true },
  compatibilityDate: '2025-04-01',
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
