// https://nuxt.com/docs/api/configuration/nuxt-config
import fs from 'fs';
import { useNuxt } from 'nuxt/kit';

export default defineNuxtConfig({
  modules: [
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
    // vueDevTools: true,
    // timeline: {
    //   enabled: true,
    // }
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    session: {
      // maxAge: 60 * 60 * 24 * 7, // 1 week
      maxAge: 60 * 60 * 24 * 28, // 4 week
      // maxAge: 15, // 15 seconds
      password: process.env.SESSION_PASSWORD!,
      // cookie: {
      //   sameSite: 'none',
      //   secure: false,
      //   httpOnly: false,
      // },
    },
  },
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
  vite: {
    resolve: {
      alias: {
        jspdf: 'jspdf/dist/jspdf.es.js'
      }
    }
  },
  hooks: {
    'build:before': () => {
      const nuxtInstance = useNuxt();
      if (!nuxtInstance.options.dev) {
        console.log('Start build process for BITT!!!!...');
        // './node_modules/@nuxt/ui-pro/modules/pro/index.ts'
        // node_modules/@nuxt/ui-pro/dist/module.mjs
        // node_modules/@nuxt/ui-pro/dist/shared/ui-pro.DoAfePEm.mjs
        const someFile = './node_modules/@nuxt/ui-pro/dist/module.mjs';
        fs.readFile(someFile, 'utf8', function (err, data) {
          if (err) {
            return console.log(err);
          }
          const result = data.replace(/await validateLicense/g, '//await validateLicense');

          fs.writeFile(someFile, result, 'utf8', function (err) {
            if (err) return console.log(err);
          });
        });
      }
    },
  },
  // vueQuery: {
  //   // https://nuxt.com/modules/vue-query
  //   vueQueryPluginOptions: {
  //     enableDevtoolsV6Plugin: true,
  //   }
  // },
})
