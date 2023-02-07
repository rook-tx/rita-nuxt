<template>
  <div class="basic-hero">
    <div
      :id="safeHeadline"
      class="headline"
    >
      <h1
        ref="headline"
      >
        <!-- v-html="headline" -->
        <prismic-text :field="slice.primary.headline" />
      </h1>
    </div>
    <div class="copy">
      <prismic-rich-text :field="copy" />
      <!-- <div
        v-if="signature"
        class="signature"
      >
        <img
          src="/static/sig.png"
          alt="Rita Vinieris signature"
        >
      </div> -->
    </div>
  </div>
</template>

<script>

import { mapActions } from 'pinia'
import { useUiStore } from '@/stores/ui'

export default {

  props: {
    slice: {
      type: Object,
      default: null
    },

    data: {
      type: Object,
      default: null
    },

    items: {
      type: Array,
      default: null
    }
  },

  data() {
    return {
      headline: 'Rivini',
      safeHeadline: 'rivini',
      copy: null,
      signature: false
    }
  },

  watch: {
    data: {
      immediate: true,
      handler(data) {
        if (data) {
          this.headline = data.headline && data.headline.length ?
            this.$prismic.richTextAsPlain(data.headline) : this.headline
          this.copy = data.copy && data.copy.length ?
            data.copy : this.copy
          this.signature = data.signature

          this.safeHeadline = this.headline.toLowerCase().replace(/\s/g, '-')
        }
      }
    }
  },

  mounted() {
    setTimeout(() => {
      this.addScrollMark({
        slug: this.safeHeadline,
        scroll: this.$el.offsetTop
      })
    }, 650)
  },

  beforeUnmount() {
    this.removeScrollMark({
      slug: this.safeHeadline
    })
  },

  methods: {
    ...mapActions(useUiStore, [
      'addScrollMark',
      'removeScrollMark'
    ])
  }

}

</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.basic-hero {
  pad(5, 0, 0)
  position relative
  text-align center

  +above($tablet) {
    pad(9, 0, 0)
  }

  .headline  {
    mgn(0, 1)
    position relative
    z-index 1

    +above($tablet) {
      mgn(0, 2)
    }

    h1 {
      display1()
      display inline-block
      vertical-align bottom
      mgn(1, auto)
    }
  }

  .copy {
    pad(.5, 0)
    mgn(0, 1)

    +above($mobile) {
      mgn(0, auto)
      max-width 450px
    }

    +above($tablet) {
      col(4, 10)
      float none
      position relative
    }

    +below($tablet) {
      pad(0, 0, 1.5)
    }

    h2 {
      display2()

      +above($tablet) {
        margin (13 / 24em) 0 (-9 / 24em)
      }

      +below($tablet) {
        margin-top 0
      }
    }

    p {
      body2()
      max-width 100%

      +above($tablet) {
        margin (18 / 14em) auto
      }
    }
  }

  // .signature {
  //   position absolute
  //   right 50%
  //   margin-right -40px
  //   bottom -20px

  //   img {
  //     height 62px
  //     width 79px
  //   }
  // }
}

</style>
