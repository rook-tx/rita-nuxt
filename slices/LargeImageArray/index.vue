<template>
  <div class="large-image-array">
    <div class="headline">
      <prismic-rich-text :field="slice.primary.headline" />
    </div>

    <div class="wrap">
      <div class="copy">
        <prismic-rich-text
          :field="slice.primary.copy"
        />
      </div>

      <div 
        v-for="(im, idx) in slice.items"
        :key="idx"
        class="image">
        <modules-plax-image 
          :img-obj="im.image"
        />
      </div>
    </div>
  </div>
</template>

<script>

import { getSliceComponentProps } from '@prismicio/vue';

export default {

  props: getSliceComponentProps(['slice', 'index', 'slices', 'context']),

  data() {
    return {
      images: [],
      headline: null,
      copy: null
    };
  }

};

</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.large-image-array {
  position relative
  mgn(7, 0, 0)
  pad(7, 0)

  +above($tablet) {
    mgn(11, 0, 0)
    pad(10.5, 1, 7)
  }

  .wrap {
    display flex
    flex-wrap wrap
    position relative
    z-index 0
  }

  .headline {
    left 0
    pad(0, 1)
    position absolute
    top 0
    right 0
    z-index 1

    h2 {
      display1()
      text-align center
      mgn(1, auto)

      +above($tablet) {
        max-width 8em
        mgn(1, auto)
      }
    }
  }

  .copy {
    order 2
    col(5, 6)
    mgn(2, 0)
    margin-left (100 / 6%)

    +above($tablet) {
      display flex
      flex-direction column
      justify-content flex-end
      margin 0 5% 0 10%
      col(3.5, 10)
    }

    p {
      body1()

      a {
        label()
        underline()
      }
    }
  }

  .image {
    col(5, 6)

    img {
      width 100%
    }

    +above($tablet) {
      col(5, 10)

      &:nth-of-type(3) {
        col(6, 10)
        margin 10% 10% 0 30%
      }
    }

    &:nth-of-type(2) {
      order 1
    }

    &:nth-of-type(3) {
      order 3
      margin-left (100 / 6%)
    }
  }

  .caption {
    display block
    body2()
    margin-top 1em

    p {
      max-width 100%
    }

    +below($tablet) {
      mgn(.5, 0, 0)

      p {
        margin 0
      }
    }
  }
}

</style>

