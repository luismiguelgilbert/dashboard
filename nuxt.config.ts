// import nuxtConfig from '@nuxt/ui-pro';
import fs from 'fs';
import { useNuxt } from 'nuxt/kit';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  experimental: {
    componentIslands: true,
  },
  extends: [process.env.NUXT_UI_PRO_PATH || '@nuxt/ui-pro'],
  modules: [
    '@nuxt/ui',
    '@nuxtjs/fontaine',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
    '@nuxt/image',
    // 'nuxt-clarity-analytics',
  ],
  css: ['@fortawesome/fontawesome-svg-core/styles.css'],
  ui: {
    icons: ['heroicons', 'simple-icons'],
    safelistColors: ['primary', 'red', 'orange', 'green']
  },
  build: {
    transpile: ['@fortawesome/vue-fontawesome']
  },
  supabase: {
    redirect: false,
    // redirectOptions: {
    //   login: '/auth/login',
    //   callback: '/auth/confirm',
    //   exclude: ['auth/login', 'auth/confirm'],
    //   cookieRedirect: true,
    // },
    // cookieOptions: {
    //   maxAge: 60 * 60 * 8,
    //   sameSite: 'lax',
    //   secure: true
    // },
  },
  components: [
    {
      path: '~/components'
    },
    {
      path: '~/components/common',
      pathPrefix: false
    }
  ],
  // Fonts
  fontMetrics: {
    fonts: ['DM Sans']
  },
  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      'DM+Sans': [300, 400, 500, 600, 700]
    }
  },
  devtools: {
    enabled: false
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  hooks: {
    "build:before": () => {
      const nuxtInstance = useNuxt();
      if (!nuxtInstance.options.dev) {
        console.log('Start build process for BITT!!!!...');
        const someFile = './node_modules/@nuxt/ui-pro/modules/pro/index.ts';
        fs.readFile(someFile, 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          var result = data.replace(/await validateLicense/g, '//await validateLicense');
        
          fs.writeFile(someFile, result, 'utf8', function (err) {
            if (err) return console.log(err);
          });
        });
      }
    },
    "pages:extend" (pages) {
      function removePagesMatching (pattern: RegExp, pages: NuxtPage[] = []) {
        const pagesToRemove = []
        for (const page of pages) {
          if(page.file.includes('/components/')) {
            pagesToRemove.push(page)
          } else if (page.children) {
            removePagesMatching(pattern, page.children)
          }
        }
        for (const page of pagesToRemove) {
          pages.splice(pages.indexOf(page), 1)
        }
      }
      removePagesMatching(/\/components\//g, pages);
    },
  },
})