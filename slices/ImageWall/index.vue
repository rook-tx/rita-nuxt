<script setup>
import { getSliceComponentProps } from '@prismicio/vue'

const props = defineProps({
  ...getSliceComponentProps([ 'slice' ])
})

const headline = 'XO, RV'
// const images = ref([
//   {
//     src: '/static/165561437_157999846191594_7886655846105885825_n.jpeg',
//     link: 'https://www.instagram.com/p/CM-e0F3BP7E/'
//   },
//   {
//     src: '/static/166028319_351244912927764_4625079148904741742_n.jpeg',
//     link: 'https://www.instagram.com/p/CM77vkEBE5R/'
//   },
//   {
//     src: '/static/164172445_2830734467184427_7377712215125392104_n.jpeg',
//     link: 'https://www.instagram.com/p/CM41XiUhd_G/'
//   },
//   {
//     src: '/static/164063578_434021494340706_1738656028806787556_n.jpeg',
//     link: 'https://www.instagram.com/p/CM2W67UBewh/'
//   }
// ])

const images = props.slice.items.map((item) => {
  return {
    src: item.post.url,
    obj: item.post,
    link: item.link.url ? item.link.url : 'https://www.instagram.com/ritavinieris'
  }
})

</script>

<template>
  <div class="image-wall">
    <div class="wrap">
      <div class="headline">
        <h2
          class="display1"
          v-html="headline"
        />
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
      <div
        v-for="(im, idx) in images"
        :key="idx"
        class="image"
      >
        <a
          :href="im.link"
          rel="noopener"
          target="_blank"
        >
          <modules-plax-image
            :img-obj="im.obj"
          />
          <!-- :src="im.src"
          :scroll="scroll"
          :p-top="elTop"
          :inview="inview"
          :parent="true" -->
          <span
            class="caption"
          >@ritavineris</span>
        </a>
      </div>
    </div>
  </div>
</template>

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
    top 50%
    transform translateY(-50%)
    pointer-events none
    text-align center
    width 100%
    z-index 1

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
