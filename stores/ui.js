import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    galleryOpen: false,
    scrollMarks: [],
    logoShown: true,
    logoDims: { x: 280, y: 72 },
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

    addScrollMark(mark) {
      const marks = this.scrollMarks

      const midx = marks.findIndex((m) => m.slug === mark.slug)

      if (midx > -1) {
        marks.splice(midx, 1, mark)
      } else {
        marks.push(mark)
      }

      this.scrollMarks = marks
    },

    removeScrollMark(mark) {
      const marks = this.scrollMarks

      const midx = marks.findIndex((m) => m.slug === mark.slug)

      if (midx > -1) {
        marks.splice(midx, 1)
      }

      this.scrollMarks = marks
    },
  },
})
