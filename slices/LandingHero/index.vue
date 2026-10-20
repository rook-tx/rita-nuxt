<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { motion, useScroll, useMotionValueEvent } from 'motion-v'
import { getSliceComponentProps } from '@prismicio/vue'
import { useDeviceStore } from '@/stores/device'

defineProps({
  ...getSliceComponentProps(['slice', 'index']),
})

const deviceStore = useDeviceStore()
const { win } = storeToRefs(deviceStore)

const uiStore = useUiStore()
const { logoDims } = storeToRefs(uiStore)
const { showLogo, hideLogo } = uiStore

const el = ref(null)
const lockupRef = ref(null)
const delta = ref(0.2)
const deltaY = ref(0.2)
const minusY = ref(-100)
const plax = ref(0)

const invertFactor = computed(() => {
  return Math.min(1, plax.value)
})

const factor = computed(() => {
  return 1 - (1 - delta.value) * invertFactor.value
})

const yFactor = computed(() => {
  return minusY.value + deltaY.value * invertFactor.value
})

watch(win, () => {
  nextTick(updateDims)
})

watch(invertFactor, (factor, oldFactor) => {
  if (factor === 1) {
    showLogo()
  } else if (oldFactor === 1 && factor < 1) {
    hideLogo()
  }
})

const { scrollYProgress } = useScroll({
  target: el,
  offset: ['start start', 'end start'],
})

useMotionValueEvent(scrollYProgress, 'change', (latest) => {
  plax.value = latest
})

function updateDims() {
  if (el.value && lockupRef.value) {
    delta.value = logoDims.value.x / lockupRef.value.$el.clientWidth
    minusY.value = lockupRef.value.$el.clientHeight / -2
    deltaY.value = logoDims.value.y + el.value.clientHeight / 2
  }
}

onMounted(() => {
  hideLogo()
  updateDims()
})

onBeforeUnmount(() => {
  showLogo()
})
</script>

<template>
  <div class="landing-hero headline-center" ref="el">
    <div class="image">
      <modules-plax-image :img-obj="slice.primary.image" loading="eager" />
    </div>

    <div class="headline">
      <motion.div
        :class="['scale-wordmark', invertFactor < 1 ? 'show' : 'hide']"
        :style="{
          transform: `translateY(${yFactor}px) translateZ(0) scale(${factor})`,
        }"
      >
        <svg-lockup ref="lockupRef" />
      </motion.div>
    </div>
  </div>
</template>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.landing-hero {
  position relative

  .headline  {
    mgn(.5, 1)
    position relative
    z-index 1

    +above($tablet) {
      mgn(0, 2)
    }

    h1, .scale-headline {
      display1()
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
    transform-origin center
    right 0

    svg {
      fill $black
      width 100%
    }

    &.hide {
      opacity 0
    }
  }

  .scale-headline {
    left 0
    position absolute
    top 0
    transform-origin left center
  }

  .plax-spacer {
    padding-bottom 61.4826%
  }

  .image {
    background-size cover
    position relative
    max-height 85vh
    overflow hidden
    z-index 0

    +above($tablet) {
      max-height 99vh
    }

    // img {
    //   opacity 0
    //   width 100%
    // }
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
