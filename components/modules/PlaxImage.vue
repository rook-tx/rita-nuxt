<template>
  <div class="plax-image">
    <div class="plax-in">
      <!-- <div
        ref="im"
        class="plax-spacer"
        :style="{
          paddingBottom: `${ar * 100}%`
        }"
      />

      <transition
        appear
      >
        <div
          v-show="rinview && ready"
          class="plax-im"
          :style="{
            transform: `scale(${scale}) translateY(${inplax}%) translateZ(0)`
          }"
        >
          <img
            class="img"
            :src="uncompressSrc"
            alt=""
            @load.stop="onload"
          >
          <img
            v-if="alt && !canTouch"
            :src="uncompressAlt"
            alt=""
            class="alt-hover"
          >
        </div>
      </transition> -->

      <prismic-image :field="imgObj" />
    </div>
  </div>
</template>

<script>

import { mapState } from 'pinia'
import { useDeviceStore } from '~~/stores/device'

export default {

  props: {
    scroll: {
      type: Number,
      default: 0
    },

    pTop: {
      type: Number,
      // default: window.innerHeight
      default: 900
    },

    imgObj: {
      type: Object,
      default: null
    },

    src: {
      type: String,
      default: null
    },

    alt: {
      type: String,
      default: null
    },

    inview: {
      type: Boolean,
      default: false
    },

    parent: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      ar: 1000 / 800,
      ready: false,
      scale: 1.01,
      rinview: false,
      // ininview: false,
      uncompressSrc: null,
      uncompressAlt: null,
      // elTop: window.innerHeight * 2,
      // top: window.innerHeight * 2,
      // elHeight: window.innerHeight,
      // bottom: window.innerHeight * 2,
      // elEnd: window.innerHeight * 3,
      // travel: window.innerHeight,
      // lastScroll: Number(0),
      delta: 0.5,
      // showAlt: false,
      dimQuery: null
    }
  },

  computed: {
    ...mapState(useDeviceStore, [
      'mobile'
    ]),
    // ...mapGetters([
    //   'win',
    //   'winHeight',
    //   'winWidth',
    //   'canTouch',
    //   'mobile',
    //   'nano'
    // ]),

    inplax() {
      return (this.delta - 0.5) * (this.mobile ? 12 : 18)
    }
  },

  watch: {
    pTop: {
      handler() {
        this.updateDims()
      }
    },

    inview: {
      handler() {
        this.updateDims()
      }
    },

    // scroll: {
    //   handler(top) {
    //     this.diffScroll(top);
    //   }
    // },

    dimQuery: {
      handler() {
        if (this.src) {
          this.uncompressSrc = this.uncompress(this.src)
        }

        if (this.alt) {
          this.uncompressAlt = this.uncompress(this.alt)
        }
      }
    },

    imgObj: {
      immediate: true,
      handler(obj) {
        if (obj && obj.dimensions) {
          this.ar = obj.dimensions.height / obj.dimensions.width
        }
      }
    }
  },

  methods: {
    uncompress(src) {
      const compsrc = src.replace('auto=compress,format', 'auto=compress,format&q=70&cs=srgb')
      const qidx = compsrc.indexOf('&w=')
      if (this.dimQuery && qidx > 0) {
        return compsrc.substring(0, qidx) + this.dimQuery + (this.nanoIm && this.nano ? '&dpr=2' : '')
      }
      return compsrc
    },

    updateDims() {

      this.elTop =
        (this.parent ? this.$el.parentNode.offsetTop + this.$el.offsetParent.offsetTop : this.$el.offsetTop)
        + this.pTop
      this.top = this.elTop - this.winHeight / 4
      this.elHeight = this.$el.clientHeight
      this.elEnd = this.elTop + this.elHeight + this.winHeight
      this.bottom = this.elEnd + this.winHeight / 3

      this.scale = (this.mobile ? 1 : 1.02) +
        Math.max(0, (this.winHeight - this.elHeight) / this.winHeight * 20 / 100)

      this.travel = this.winHeight + this.elHeight

      if (this.$refs.im && this.$refs.im.clientWidth > 0) {
        this.dimQuery = `&w=${Math.round(this.$refs.im.clientWidth * this.scale)}`
        this.nanoIm = this.$refs.im.clientWidth < this.winWidth / 2
      }

      this.$nextTick(this.diffScroll(this.scroll))

    },

    diffScroll(scroll) {
      this.rinview = this.top < scroll && this.bottom > scroll

      if (this.rinview) {
        this.delta = (scroll - this.elTop) / this.travel
      }
    },

    onload(e) {
      this.ar = e.target.naturalHeight / e.target.naturalWidth
      this.ready = true
    }
  }

}

</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

$easeIm = cubic-bezier(0.455, 0.03, 0.515, 0.955)

.plax-image {
  // position relative
  // width 100%
  transform translateZ(0)

  .plax-in {
    background $bg
    overflow hidden
    position relative
    transform translateZ(0)
  }

  .plax-spacer {
    height 0
    padding-bottom (1200 / 800 * 100%)
    position relative
    transform translateZ(0)
    width 100%
  }

  .plax-im {
    abs()
    transition opacity $beat $easeOutSoft

    img {
      abs()
      height auto
    }

    .img {
      transition transform $beat * 2 $easeOutSoft
      transform scale(1)
    }

    opacity 1

    &.v-enter,
    &.v-leave-to {
      opacity 0
    }

    .alt-hover {
      opacity 0
      abs()
      transition opacity $beat $easeIm
    }

    button:hover &,
    button:focus & {
      .alt-hover {
        +above($tablet) {
          opacity 1
        }
      }
    }

    .zooming & {
      .alt-hover {
        opacity 0
      }
    }
  }
}

.dark-ui {
  .plax-in {
    background lighten($black, 1%)
  }
}

</style>
