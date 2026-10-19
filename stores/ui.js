import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    galleryOpen: false,
    logoShown: true,
    logoDims: { x: 280, y: 72 },
    lightUi: true,
  }),

  actions: {
    showLogo() {
      this.logoShown = true
    },

    hideLogo() {
      this.logoShown = false
    },

    setLogoDims({ x, y }) {
      this.logoDims = { x, y }
    },

    toggleGallery(open) {
      this.galleryOpen = open
    },

    setLightUi(bool) {
      this.lightUi = bool
    },
  },
})
