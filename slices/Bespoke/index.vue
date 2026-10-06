<template>
  <div id="bespoke" class="bespoke">
    <div class="wrap">
      <div class="headline">
        <h2>Bespoke</h2>
      </div>

      <div v-for="(im, idx) in slice.items" :key="idx" class="image">
        <div class="content">
          <!-- :src="im.src"
          :scroll="scroll"
          :inview="inview"
          :p-top="elTop"
          :parent="true"
          -->
          <modules-plax-image :img-obj="im.image" />
          <prismic-rich-text v-if="im.caption" class="caption" :field="im.caption" />
        </div>
      </div>

      <div v-if="slice.primary.copy" class="copy">
        <prismic-rich-text :field="slice.primary.copy" />
      </div>
    </div>
  </div>
</template>

<script>
// import { mapActions } from 'vuex'

import { getSliceComponentProps } from '@prismicio/vue'
// import cmsProps from '../mixins/cms-props.js'
// import parallax from '../mixins/parallax.js'

export default {
  // mixins: [cmsProps, parallax],

  props: {
    ...getSliceComponentProps(['slice']),
  },

  data() {
    return {
      lightUi: true,
    }
  },

  watch: {
    slice: {
      immediate: true,
      handler(slice) {
        if (slice.items && slice.items.length && slice.items[0].image && slice.items[0].image.url) {
          this.images = slice.items.map((item) => {
            return {
              src: item.image.url,
              caption: item.caption && item.caption.length ? item.caption : null,
            }
          })
        }
      },
    },

    lightUi: {
      immediate: true,
      handler(ui) {
        this.$root.$emit('ui', ui)
      },
    },
  },

  mounted() {
    setTimeout(() => {
      this.addScrollMark({
        slug: 'bespoke',
        scroll: this.$el.offsetTop,
      })
    }, 650)
  },

  beforeDestroy() {
    this.$root.$emit('ui', true)
    this.removeScrollMark({
      slug: 'bespoke',
    })
  },

  methods: {
    // ...mapActions(['addScrollMark', 'removeScrollMark']),

    diffScroll(scroll) {
      this.inview = this.elTop < scroll && this.elEnd > scroll
      this.lightUi = scroll < this.top
    },
  },
}
</script>

<style lang="stylus">

@import "../../assets/stylus/_variables.styl"

.bespoke {
  position relative
  pad(9, 0)

  +above($tablet) {
    pad(12.5, 1, 15)
  }

  .wrap {
    display flex
    position relative

    +above($tablet) {
      flex-wrap wrap
    }

    +below($tablet) {
      flex-direction column
    }
  }

  .headline {
    left 0
    position absolute
    top 0
    text-align center
    width 100%
    z-index 1

    h2 {
      mgn(-1, auto, 0)
      display1()

      +above($tablet) {
        mgn(-2.5, auto, 0)
      }
    }
  }

  .image {
    .content,
    button {
      width 100%
    }

    &:nth-child(2) {
      order 2
      col(4, 6)
    }

    &:nth-child(3) {
      order 4
      col(2.5, 6)
      z-index 1
    }

    &:nth-child(4) {
      order 5
      col(5, 6)
      margin $let * -3rem 0 0 (100% / 6)
    }

    +above($tablet) {
      position relative

      &:nth-child(2) {
        order 2
        col(4, 10)
      }

      &:nth-child(3) {
        order 4
        col(2, 10)
        margin 0 0 0 50%
        z-index 1
      }

      &:nth-child(4) {
        order 5
        col(4, 10)
        margin 10% 0 0 -10%
      }
    }
  }

  .copy {
    order 3
    col(5, 6)
    margin $let * 1rem 0 $let * 1rem (100% / 6)

    +above($tablet) {
      col(4, 10)
      margin 20% 0 0 20%
    }

    p {
      body1()
    }

    a, button {
      label()
      underline()
    }
  }

  .gallery-overlay {
    .bg {
      background $black
    }

    .close {
      path {
        stroke $w
      }
    }
  }
}
</style>
