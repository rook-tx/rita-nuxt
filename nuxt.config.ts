// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
    },
  },

  app: {
    baseURL: '/',

    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Welcome',
      titleTemplate: '%s • Rita Vinieris',
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { id: 'description', name: 'description', content: 'Rita Vinieris' },

        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Rita Vinieris' },
        {
          property: 'og:image',
          content:
            'https://images.prismic.io/rita-vinieris/ZmMrqpm069VX1j1C_BOWIE_Rivini_SS25-3-.jpg?auto=compress,format&q=75&cs=srgb&rect=0,2049,5332,2566&w=1280',
        },
        {
          name: 'description',
          content:
            'Rita Vinieris combines a unique vision with couture level craftsmanship to create iconic dresses that celebrate the women who wear them.',
        },
        {
          property: 'og:description',
          content:
            'Rita Vinieris combines a unique vision with couture level craftsmanship to create iconic dresses that celebrate the women who wear them.',
        },
        { property: 'twitter:site', content: 'Rita Vinieris' },
        { property: 'twitter:card', content: 'summary' },
        { name: 'twitter:domain', content: 'https://twitter.com/RitaVinieris' },
        { name: 'p:domain_verify', content: '20af8e0ce2c8ad56538e6a7fdf8f4916' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          href: '/apple-touch-icon.png',
        },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css',
          integrity:
            'sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==',
          crossorigin: '',
        },
      ],
      script: [
        {
          async: true,
          src: 'https://www.googletagmanager.com/gtag/js?id=G-MX1CENWGQW',
        },
        {
          innerHTML: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MX1CENWGQW');`,
          type: 'text/javascript',
        },
        {
          src: 'https://www.youtube.com/iframe_api',
        },
        {
          src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB06N822-_Wm9I9KaWtoqg3wwX8MbOBYPo&libraries=places&loading=async',
        },
        {
          src: 'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js',
          integrity:
            'sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==',
          crossorigin: '',
          async: true,
        },
      ],
    },
  },

  modules: ['@pinia/nuxt', '@nuxtjs/prismic'],

  prismic: {
    endpoint: 'rita-vinieris',
    preview: false,
    toolbar: false,
  },

  vite: {
    optimizeDeps: {
      include: ['@prismicio/client', '@vue/devtools-core', '@vue/devtools-kit', 'fuse.js'],
    },
  },
})
