import { defineStore } from "pinia"

export const useSearchStore = defineStore('search', {

  state: () => ({
    open: false
  }),

  getters: {
    searchOpen: (state) => state.open
  },

  actions: {
    openSearch() {
      this.open = true;
    },

    closeSearch() {
      this.open = false;
    },

    toggleSearch() {
      this.open = !this.open;
    }
  }

})
