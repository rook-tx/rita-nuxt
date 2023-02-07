<script setup>
import { isFilled } from '@prismicio/helpers'
import { getSliceComponentProps } from '@prismicio/vue'

const props = defineProps({
  ...getSliceComponentProps([ 'slice' ])
})

const layout = isFilled.keyText(props.slice.primary.layout) ? props.slice.primary.layout.toLowerCase().replace(/\s/g, '-') : 'image-left'

</script>

<template>
  <div class="image-copy">
    <div :class="[ 'wrap', layout ]">
      <div
        v-if="slice.primary.headline"
        class="headline"
      >
        <prismic-rich-text
          :field="slice.primary.headline"
        />
      </div>

      <div
        class="image"
      >
        <!-- :src="src"
      :scroll="scroll"
      :inview="inview"
      :p-top="elTop" -->
        <modules-plax-image
          :img-obj="slice.primary.image"
        />

        <!-- <div
          v-if="signature"
          class="signature"
        >
          <img
            src="/static/sig.svg"
            alt="Rita Vinieris signature"
          >
        </div> -->
      </div>

      <div class="copy">
        <prismic-rich-text
          v-if="slice.primary.copy"
          :field="slice.primary.copy"
        />
      </div>
    </div>
  </div>
</template>
<!--
<script>

import cmsProps from '../mixins/cms-props.js'
import parallax from '../mixins/parallax.js'

export default {

  mixins: [
    cmsProps,
    parallax
  ],

  data() {
    return {
      headline: null,
      layout: 'image-left'
    }
  },

  computed: {
    signature() {
      return this.layout === 'image-right'
    }
  }

}

</script> -->

<style lang="stylus">

@import "../../assets/stylus/_variables"

.image-copy {
  position relative
  mgn(0, 0, 5)

  +above($tablet) {
    mgn(9, 0)
    pad(0, 1)
  }

  .wrap {
    +above($tablet) {
      // align-items center
      display flex
      flex-wrap wrap
    }
  }

  .headline {
    text-align center
    width 100%

    h1 {
      mgn(7, auto, 3)
      display1()
    }

    +above($tablet) {
      // left 0
      // position absolute
      // top 0

      h1 {
        mgn(.5, auto, 3.5)
        // mgn(-2.5, auto, 0)
      }
    }
  }

  .image {
    position relative

    img {
      width 100%
    }

    +above($tablet) {
      col(5, 10)
    }

    +below($tablet) {
      mgn(0, 0, 0, -.5)
      margin-right 10%
    }
  }

  .copy {
    pad(1, .5)

    +above($tablet) {
      col(4, 10)
      margin-left 10%
      margin-top $let * 3em
    }

    h2 {
      label()
    }

    p {
      body1()
    }
  }

  .image-right {
    +above($tablet) {
      .copy {
        order 1
      }

      .image {
        order 2
        margin-left 10%
        col(4, 10)
      }
    }

    +below($tablet) {
      .image {
        col(5, 6)
        margin-left (100% / 6)
        margin-right 0
      }
    }
  }

  .signature {
    position absolute
    left -26px
    bottom 40px

    img {
      height 100px
      width 92px
    }
  }
}

</style>
