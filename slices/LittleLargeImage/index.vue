<template>
  <div
    :class="[
      'little-large-image',
      {
        'layout-right': right,
      },
    ]"
  >
    <div
      :class="[
        'wrap',
        {
          'hard-hover': hardHover,
        },
      ]"
    >
      <div class="image" @mouseover="mouseOverLink" @mouseout="mouseOutLink">
        <nuxt-link :to="route">
          <modules-plax-image :img-obj="slice.primary.image" />
          <!-- :src="imageUrl" :scroll="scroll" :inview="inview" :p-top="elTop" /> -->
        </nuxt-link>
      </div>

      <div class="content">
        <div
          v-if="slice.primary.copy && slice.primary.copy.constructor === Array"
          ref="copy"
          class="copy"
        >
          <prismic-rich-text :field="slice.primary.copy" />
        </div>
      </div>

      <div class="image" @mouseover="mouseOverLink" @mouseout="mouseOutLink">
        <nuxt-link :to="route">
          <modules-plax-image :img-obj="slice.primary.little_image" />
          <!-- :src="littleUrl" :scroll="scroll" :inview="inview" :p-top="elTop" /> -->
        </nuxt-link>
      </div>
    </div>

    <div v-show="inview" class="back-headline">
      <div class="headline">
        <letter-roll v-if="slice.primary.headline" :copy="headlineText" v-show="inviewLetters" />
      </div>
    </div>
  </div>
</template>

<script>
// import cmsProps from '../mixins/cms-props.js'
// import parallax from '../mixins/parallax.js'

import LetterRoll from '@/components/modules/LetterRoll.vue'
import { asText } from '@prismicio/client'

export default {
  components: {
    LetterRoll,
  },

  // mixins: [cmsProps, parallax],

  props: {
    ...getSliceComponentProps(['slice']),
  },

  data() {
    return {
      right: false,
      imageUrl: null,
      littleUrl: null,
      inviewLetters: false,
      hardHover: false,
      route: '#',
    }
  },

  computed: {
    headlineText() {
      return this.slice &&
        this.slice.primary.headline &&
        this.slice.primary.headline.constructor === Array
        ? `${asText(this.slice.primary.headline)}`
        : ''
    },
  },

  watch: {
    slice: {
      immediate: true,
      handler(slice) {
        if (slice) {
          this.right = slice.primary.layout
          this.imageUrl = slice.primary.image.url || this.imageUrl
          this.littleUrl = slice.primary.little_image.url || this.littleUrl
          this.headline = slice.primary.headline
        }
      },
    },
  },

  mounted() {
    setTimeout(() => {
      this.findLink()
    }, 2000)
  },

  beforeDestroy() {
    if (this.link) {
      this.link.addEventListener('mouseover', this.mouseOverLink, { passive: true })
      this.link.addEventListener('mouseout', this.mouseOutLink, { passive: true })
    }
  },

  methods: {
    diffScroll(scroll) {
      this.screens = Math.floor(scroll / this.winHeight)
      this.inview = this.elTop < scroll && this.elEnd > scroll
      this.inviewLetters = this.top < scroll && this.bottom > scroll
      // this.dir = scroll > this.lastScroll;
      // this.lastScroll = scroll;
    },

    findLink() {
      this.link = this.$refs.copy.getElementsByTagName('a')[0]

      if (this.link) {
        this.route = this.link.pathname
        this.link.addEventListener('mouseover', this.mouseOverLink, { passive: true })
        this.link.addEventListener('mouseout', this.mouseOutLink, { passive: true })
      }
    },

    mouseOverLink() {
      this.hardHover = true
    },

    mouseOutLink() {
      this.hardHover = false
    },
  },
}
</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.little-large-image {
  position relative
  pad(4, 0)
  z-index 0

  +above($tablet) {
    pad(7, 1)
  }

  .back-headline {
    abs()
    display flex
    position fixed
    pointer-events none
    z-index 1

    .headline {
      margin auto
    }

    h2 {
      display1()
    }
  }

  .wrap {
    position relative
    z-index 0

    +below($tablet) {
      display flex
      flex-wrap wrap
      pad(.5, 0)
    }

    &.hard-hover {
      a::after {
        transform scaleX(0)
      }

      .image {
        img {
          transform scale(1.05)
        }
      }
    }
  }

  .content {
    order 3

    +above($tablet) {
      float left
      margin 0 10% 0
      col(4, 10)
    }

    +below($tablet) {
      pad(3, 1, 0)
      text-align center
    }

    h2 {
      display2()
    }

    p {
      body1()
    }
  }

  .cta {
    a {
      label()
      underline()
    }
  }

  .copy {
    h3 {
      display2()
    }

    a {
      label()
      underline()
    }
  }

  .image {
    +above($tablet) {
      float left
      col(4, 10)

      &:last-child {
        col(2, 10)
        margin 0 0 0 40%
      }
    }

    +below($tablet) {
      &:nth-of-type(1) {
        order 1
        flex-basis (400% / 6)
      }

      &:nth-of-type(3) {
        order 2
        flex-basis (300% / 6)
        margin (300% / 6) 0 0 (100% / -6)
      }
    }
  }

  &.layout-right {
    +above($tablet) {
      .wrap {
        align-items flex-end
        display flex
        flex-wrap wrap
      }

      .content {
        order 2
        margin 0 10% 0
      }

      .image {
        &:nth-of-type(1) {
          float right
          order 3
        }

        &:nth-of-type(3) {
          order 1
          margin 0 80% -20% 0
        }
      }
    }
  }
}
</style>
