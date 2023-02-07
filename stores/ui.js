import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {

  state: () => ({
    galleryOpen: false,
    scrollMarks: []
  }),

  // getters: {
  //   galleryOpen: (state) => state.galleryOpen,
  //   scrollMarks: (state) => state.scrollMarks
  // },

  actions: {
    toggleGallery(open) {
      this.galleryOpen = open;
    },

    addScrollMark(mark) {
      const marks = this.scrollMarks;

      const midx = marks.findIndex((m) => m.slug === mark.slug);

      if (midx > -1) {
        marks.splice(midx, 1, mark);
      } else {
        marks.push(mark);
      }

      this.scrollMarks = marks;
    },

    removeScrollMark(mark) {
      const marks = this.scrollMarks;

      const midx = marks.findIndex((m) => m.slug === mark.slug);

      if (midx > -1) {
        marks.splice(midx, 1);
      }

      this.scrollMarks = marks;
    }
  }

})
