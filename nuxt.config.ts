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
  components: [{
    path: '~/components'
  }, {
    path: '~/components/common',
    pathPrefix: false
  }],
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
    enabled: true
  }
})