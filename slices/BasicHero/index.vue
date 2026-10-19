<script setup>
import { getSliceComponentProps } from '@prismicio/vue'
import { asText } from '@prismicio/client'

const props = defineProps({
  ...getSliceComponentProps(['slice']),
})

const headline = asText(props.slice.primary.headline)
const safeHeadline = headline.toLowerCase().replace(/\s/g, '-')
</script>

<template>
  <div class="basic-hero">
    <div :id="safeHeadline" class="headline">
      <h1>
        <prismic-text :field="slice.primary.headline" />
      </h1>
    </div>
    <div class="copy">
      <prismic-rich-text :field="slice.primary.copy" />
    </div>
  </div>
</template>

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
}
</style>
