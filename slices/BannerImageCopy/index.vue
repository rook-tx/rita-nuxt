<template>
  <div class="banner-image-copy">
    <modules-plax-image 
      :img-obj="slice.primary.image"
    />

    <div class="copy">
      <div class="wrap">
        <div class="eight-ten-col">
          <div class="headline">
            <prismic-rich-text
            :field="slice.primary.headline" />
          </div>

          <div class="t">
            <p>Visit our store locator for a complete list of Rita Vinieris stores and&nbsp;retailers.</p>
            <p>
              <router-link
                to="/find-store"
                class="label cta"
              >
                Find a store
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { getSliceComponentProps } from '@prismicio/vue';

export default {
  props: {
    ...getSliceComponentProps([ 'slice' ])
  }
} 
</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.banner-image-copy {
  position relative
  padding-bottom $let * 6rem

  +above($tablet) {
    padding-bottom $let * 10rem
  }

  .little-large-image + & {
    +above($tablet) {
      pad(4, 0, 10)
    }
  }

  .copy {
    position relative
    z-index 1

    +above($tablet) {
      mgn(0, 1)
    }
  }

  .eight-ten-col {
    +above($tablet) {
      mgn(0, auto)
    }

    +below($tablet) {
      width 100%
    }

    p {
      body1()
      max-width 24em
      mgn(1, auto)
      text-align center
    }
  }

  .headline  {
    position relative
    mgn(-1, 0, 0)
    z-index 1

    h2, .scale-headline {
      display1()
      white-space nowrap
      line-height 1

      +above($tablet) {
        line-height .82
      }
    }

    h2 {
      display inline-block
      vertical-align bottom
      opacity 0
      margin 0
    }
  }

  .scale-headline {
    left 0
    position absolute
    top 0
    transform-origin left center
  }

  .image {
    background-size cover
    position relative
    max-height 100vh
    overflow hidden
    z-index 0

    img {
      opacity 0
      width 100%
    }
  }

  .t {
    +above($tablet) {
      p {
        max-width 100%
      }
    }

    +below($tablet) {
      max-width 14em
      mgn(2, auto, 0)
    }
  }

  .cta {
    mgn(.5, auto)
    underline()
  }
}

</style>
  
