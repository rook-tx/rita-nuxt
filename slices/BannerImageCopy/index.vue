<script setup>
import { getSliceComponentProps } from '@prismicio/vue'

defineProps({
  ...getSliceComponentProps(['slice']),
})

const headline = 'Make an Entrance'
const headlineEl = ref(null)
const scaleHeadline = ref(null)
const scale = ref(2)
const padding = ref(50)

const deviceStore = useDeviceStore()
const { win } = storeToRefs(deviceStore)

function updateScale() {
  scale.value = headlineEl.value
    ? (win.value.x > 768 ? (win.value.x - 80) * 0.8 : win.value.x - 40) /
      headlineEl.value.clientWidth
    : 2
  padding.value = scaleHeadline.value ? (scaleHeadline.value.clientHeight * scale.value) / 2 : 50
}

watch(win, updateScale)

onMounted(() => {
  updateScale()
})
</script>

<template>
  <div class="banner-image-copy">
    <modules-plax-image :img-obj="slice.primary.image" />

    <div class="copy">
      <div class="wrap">
        <div class="eight-ten-col">
          <div
            class="headline"
            :style="{
              height: `${padding}px`,
            }"
          >
            <span
              ref="scaleHeadline"
              class="scale-headline"
              :style="{
                transform: `translateY(-50%) scale(${scale})`,
              }"
              v-html="headline"
            />

            <h2 ref="headlineEl" v-html="headline" />
          </div>

          <div class="t">
            <p>
              Visit our store locator for a complete list of Rita Vinieris stores
              and&nbsp;retailers.
            </p>
            <p>
              <router-link to="/find-store" class="label cta"> Find a store </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
