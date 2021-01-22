import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'universal',
  generate: {
    fallback: true, // if you want to use '404.html' instead of the default '200.html'
    fallback: '404.html' // if your hosting needs a custom location
  },
  //  server:{
  //  port:8000,
  //  host:'0.0.0.0'
  // },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: 'XcelMart by xceldeveloper',
    title: '',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1,user-scalable=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    noscript: [{
      innerHTML: 'This Web application requires JavaScript Please Turn it on From Browser Settings.'
    }],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/icon.png'
    }],
    script: [{
      src: 'https://js.paystack.co/v1/inline.js'
    }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },
  /*
   ** Global CSS
   */
  css: [
    '~/static/materialdesignicons.min.css',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    // '~/plugins/vuetify.js'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/pwa', //for app version only
   // "@nuxtjs/firebase" disabled
  
  ],
  pwa: {
    manifest: {
      name: 'XcelMart',
      short_name: 'XcelMart',
      lang: 'en',
      display: 'fullscreen',
      theme_color: '#002857',
      background_color: '#ffffff',
      "orientation": "portrait",
      start_url: '/',
      mobileAppIOS: true
    },
    workbox: {
      // /* workbox options */
      runtimeCaching: [{
        urlPattern: 'https://js.paystack.co/v1/inline.js',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: {
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }]
    }
  },

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios'
  ],

  axios:{
     baseURL: 'http://localhost:8000'
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    //customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        // dark: {
        //   primary: colors.blue.darken2,
        //   accent: colors.grey.darken3,
        //   secondary: colors.amber.darken3,
        //   info: colors.teal.lighten1,
        //   warning: colors.amber.base,
        //   error: colors.deepOrange.accent4,
        //   success: colors.green.accent3
        // }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
