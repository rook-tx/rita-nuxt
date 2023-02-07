// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Welcome',
      titleTemplate: '%s • Rita Vinieris',
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { hid: 'description', name: 'description', content: 'Rita Vinieris' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', type: 'image/png', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ],
      script: [
        {
          async: true,
          src: 'https://www.googletagmanager.com/gtag/js?id=G-MX1CENWGQW'
        },
        {
          children: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MX1CENWGQW');`
        }
      ]
    }
  },

  modules: [
    '@nuxtjs/prismic',
    '@pinia/nuxt',
  ],

  prismic: {
    endpoint: 'rita-vinieris',
    preview: false,
    toolbar: false
  },
})
