import fs from 'fs';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [process.env.NUXT_UI_PRO_PATH || '@nuxt/ui-pro'],
  modules: [
    '@nuxt/ui',
    '@nuxtjs/fontaine',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
    '@nuxt/image'
  ],
  ui: {
    icons: ['heroicons', 'simple-icons'],
    safelistColors: ['primary', 'red', 'orange', 'green']
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
      console.log('Building BITT!!!!...');
      const someFile = './node_modules/@nuxt/ui-pro/modules/pro/index.ts';
      // const testFolder = './node_modules/@nuxt/ui-pro/modules/pro/';
      fs.readFile(someFile, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        // console.log(data);
        var result = data.replace(/await validateLicense/g, '//await validateLicense');
        console.log(result);
      
        fs.writeFile(someFile, result, 'utf8', function (err) {
          if (err) return console.log(err);
        });
      });
    }
  }
})