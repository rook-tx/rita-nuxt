<template>
  <div class="image-wall">
    <div class="wrap">
      <div class="headline">
        <h2 class="display1">
          XO, RV
        </h2>
        <h3 class="label">
          <a
            href="https://www.instagram.com/ritavinieris/"
            target="_blank"
            rel="noopener"
          >
            Follow us
          </a>
        </h3>
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

.image-wall {
  position relative
  pad(4, 0)

  +above($tablet) {
    pad(7, 1)
  }

  .headline {
    left 0
    position absolute
    top 0
    mgn(15, 0, 1)
    margin-top 80%
    pointer-events none
    text-align center
    width 100%
    z-index 1

    +above($tablet) {
      mgn(24, 1, 1)
    }

    h2, h3 {
      mgn(1, auto)
    }

    a[target=_blank] {
      pointer-events auto
      extarrow()
    }
  }

  .image {
    position relative

    img {
      width 100%
    }

    float left

    &:nth-of-type(2) {
      col(4, 6)
      padding 0
      margin 10% 0 0 $gut * -1em
    }

    &:nth-of-type(3) {
      col(2, 6)
      padding 0
      float right
      margin-right $gut * -1em
    }

    &:nth-of-type(4) {
      clear left
      col(3, 6)
      padding 0
      margin 40% 0 0 $gut * -1em
    }

    &:nth-of-type(5) {
      col(3, 6)
      padding 0
      float right
      margin 10% $gut * -1em 0 0
    }

    +above($tablet) {
      float left

      &:nth-of-type(2) {
        col(3, 10)
        padding 0
        margin 20% 0 0 0
      }

      &:nth-of-type(3) {
        col(2, 10)
        padding 0
        float left
        margin 0 0 10% 30%
      }

      &:nth-of-type(4) {
        clear left
        col(2, 10)
        padding 0
        margin 5% 0 0 20%
      }

      &:nth-of-type(5) {
        col(3, 10)
        padding 0
        margin -15% 0 0 30%
      }

      &:hover {
        .caption {
          opacity 1
        }
      }
    }


    a {
      &:hover,
      &:focus {
        img {
          transform scale(1.05)
        }
      }
    }
  }

  .caption {
    label()
    font-smoothing()
    opacity 0
    extarrow()
  }
}

</style>  
