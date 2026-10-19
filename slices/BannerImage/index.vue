<template>
  <div
    :class="[
      'banner-image',
      {
        'headline-center': layout && layout === 'centre',
      },
    ]"
  >
    <modules-plax-image :img-obj="slice.primary.image" />

    <div class="headline" :style="{ height: `${padding}px` }">
      <div v-if="wordmark" class="scale-wordmark">
        <prismic-image :field="slice.primary.wordmark" />
      </div>

      <span
        v-else
        ref="scaleHeadline"
        class="scale-headline"
        :style="{
          transform: renderTransform,
        }"
        v-html="headline"
      />
      <h1 ref="headline" v-html="headline" />
    </div>
  </div>
</template>

<script>
import { getSliceComponentProps } from '@prismicio/vue'
import { mapState } from 'pinia'
import { useDeviceStore } from '@/stores/device'
import { asText } from '@prismicio/client'

export default {
  props: {
    ...getSliceComponentProps(['slice', 'index']),
  },

  data() {
    return {
      scale: 2,
      padding: 50,
    }
  },

  computed: {
    ...mapState(useDeviceStore, ['win', 'winWidth']),

    layout() {
      return this.slice?.primary?.layout?.toLowerCase()
    },

    wordmark() {
      return this.slice?.primary?.wordmark?.url
    },

    headline() {
      return asText(this.slice.primary.headline)
    },

    renderTransform() {
      return `translateY(-50%) scale(${this.scale * 1.018}) translateX(-0.4%)`
    },
  },

  watch: {
    winWidth: {
      immediate: true,
      handler() {
        this.updateScale()
      },
    },
  },

  mounted() {
    this.updateScale()
  },

  methods: {
    updateScale() {
      this.scale = this.$refs.headline
        ? (this.win.x - (this.win.x < 768 ? 40 : 80)) / this.$refs.headline.clientWidth
        : 2
      this.padding = this.$refs.scaleHeadline
        ? (this.$refs.scaleHeadline.clientHeight * this.scale) / 2
        : 50
    },
  },
}
</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.banner-image {
  position relative
  transform translateZ(0)
  z-index 1

  &:first-child {
    mgn(0, 0, 2)

    +above($tablet) {
      mgn(0, 0, 6)
    }
  }

  .headline  {
    mgn(0, 1)
    position relative
    z-index 1

    +above($tablet) {
      mgn(0, 2)
    }

    h1, .scale-headline {
      display1()
      line-height 1
      white-space nowrap

      +above($tablet) {
        line-height .82
      }
    }

    h1 {
      display inline-block
      vertical-align bottom
      opacity 0
      margin 0
    }
  }

  .scale-wordmark {
    left 0
    position absolute
    top 0
    transform-origin left center
    right 0

    img {
      transform translateY(-50%)
      width 100%
    }
  }

  .scale-headline {
    left 0
    position absolute
    top 0
    transform-origin left center
  }

  .plax-spacer {
    padding-bottom 64.2857%
  }

  .image {
    background-size cover
    position relative
    max-height 80vh
    overflow hidden
    z-index 0

    img {
      opacity 0
      width 100%
    }
  }

  &.headline-center {
    .headline {
      top 50%
      left $let * 1rem
      right $let * 1rem
      margin 0
      position absolute
      text-align center

      +above($tablet) {
        left $let * 2rem
        right $let * 2rem
      }
    }
  }
}
</style>
