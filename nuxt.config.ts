// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@hebilicious/vue-query-nuxt',
    '@nuxt/eslint',
    '@nuxt/ui-pro',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-auth-utils',
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
  imports: {
    dirs: ['../shared/types']
  },
  devtools: {
    enabled: false
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
  nitro: {
    experimental: { database: true },
    database: {
      default: {
        connector: 'postgresql',
        options: {
          // url: process.env.DATABASE_URL,
          host: process.env.DATABASE_HOST,
          port: Number(process.env.DATABASE_PORT),
          database: process.env.DATABASE_NAME,
          user: process.env.DATABASE_USER,
          password: process.env.DATABASE_PWD,
          min: 10
        }
      }
    },
    imports: {
      dirs: ['shared/types']
    }
  },
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
})
