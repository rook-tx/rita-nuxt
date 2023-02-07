import { mapActions, mapState } from 'pinia'
import { useDeviceStore } from '../../stores/device'
import { useUiStore } from '../../stores/ui'

import Close from '../svg/Close.vue'
import Plus from '../svg/Plus.vue'

export default {

  components: {
    Close,
    Plus
  },

  props: {
    content: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      open: false,
      images: [],
      zoomImages: [],

      headline: null,
      copy: null,
      section: null,
      link: '',

      displayIdx: 0,

      showingZoom: false,
      showZoom: false,

      contentArs: null,

      showBack: false,
      showPag: false
    }
  },

  computed: {
    ...mapState(useDeviceStore, [
      'win'
    ]),

    winar() {
      return this.win.x / this.win.y
    },

    mobile() {
      return this.win.x < 768
    }
  },

  watch: {
    win: {
      handler() {
        this.getContentAr()
      }
    }
  },

  mounted() {
    window.addEventListener('keyup', this.keyup, { passive: true })
  },

  beforeDestroy() {
    window.removeEventListener('keyup', this.keyup, { passive: true })
  },

  methods: {
    ...mapActions(useUiStore, [
      'toggleGallery'
    ]),

    getAr(e, idx) {

      if (this.images[idx]) {
        if (!this.images[idx].ar) {
          this.images[idx].ar = e.target.clientWidth / e.target.clientHeight
        }
        this.images[idx].show = true
      }

      this.getContentAr()

    },

    getContentAr() {

      if (this.$refs.im?.length && this.contentArs.length) {

        this.$refs.im.forEach((im, idx) => {
          this.contentArs[idx] = im.clientWidth / im.clientHeight
        })
      }

    },

    keyup(e) {
      switch (e.which) {
      case 37:
      case 48:
        this.prev()
        break
      case 39:
      case 40:
        this.next()
        break
      case 27:
        if (this.expanded) {
          this.collapseImage()
        } else {
          this.closeGallery()
        }
        break
      default: break
      }
    },

    prev() {
      if (this.displayIdx < 1) {
        this.prevSet()
        return
      }
      this.displayIdx--
    },

    next() {
      if (this.displayIdx + 2 > this.images.length) {
        this.nextSet()
        return
      }
      this.displayIdx++
    },

    openGallery() {
      this.open = true
    },

    closeGallery() {
      this.$emit('closeGallery')
      this.open = false
    },

    prevSet() {
      this.$emit('prevSet')
    },

    nextSet() {
      this.$emit('nextSet')
    },

    onIms() {
      this.showBack = false
      this.showPag = true
    },

    offIms() {
      if (this.displayIdx > 0) {
        this.showPag = false
      }
    },

    onBack() {
      this.showBack = true
      this.showPag = false
    },

    offBack() {
      this.showBack = false
    }
  }
}
