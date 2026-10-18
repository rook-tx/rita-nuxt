<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { motion, useScroll, useMotionValueEvent } from 'motion-v'
import { useDeviceStore } from '@/stores/device'

const props = defineProps({
  altObj: {
    type: Object,
    default: null,
  },
  imgObj: {
    type: Object,
    default: null,
  },
})

const deviceStore = useDeviceStore()
const { mobile, winHeight } = storeToRefs(deviceStore)

const root = ref(null)
const im = ref(null)
const ar = ref(1000 / 800)
const scale = ref(1.01)
const delta = ref(0.5)
const elHeight = ref(0)

watch(
  () => props.imgObj,
  (obj) => {
    if (obj?.dimensions) {
      ar.value = obj.dimensions.height / obj.dimensions.width
    }
  },
  { immediate: true },
)

function updateDims() {
  if (!root.value) return

  elHeight.value = root.value.clientHeight

  scale.value =
    (mobile.value ? 1 : 1.02) +
    Math.max(0, (((winHeight.value - elHeight.value) / winHeight.value) * 20) / 100)
}

const { scrollYProgress } = useScroll({
  target: im,
  offset: ['start end', 'end start'],
})

useMotionValueEvent(scrollYProgress, 'change', (latest) => {
  delta.value = latest
})

const inplax = computed(() => (delta.value - 0.5) * (mobile.value ? 12 : 18))

onMounted(updateDims)
</script>

<template>
  <div ref="root" class="plax-image">
    <div class="plax-in">
      <div
        ref="im"
        class="plax-spacer"
        :style="{
          paddingBottom: `${ar * 100}%`,
        }"
      />

      <transition appear>
        <motion.div
          class="plax-im"
          :style="{
            transform: `scale(${scale}) translateY(${inplax}%) translateZ(0)`,
          }"
        >
          <prismic-image :field="imgObj" loading="lazy" class="img" />
          <prismic-image :field="altObj" loading="lazy" class="alt-hover" />
        </motion.div>
      </transition>

      <!-- <transition
        appear
      >
        <div
          v-show="rinview && ready"
          class="plax-im"
          :style="{
            transform: `scale(${scale}) translateY(${inplax}%) translateZ(0)`
          }"
        >
          <img
            class="img"
            :src="uncompressSrc"
            alt=""
            @load.stop="onload"
          >
          <img
            v-if="alt && !canTouch"
            :src="uncompressAlt"
            alt=""
            class="alt-hover"
          >
        </div>
      </transition> -->
    </div>
  </div>
</template>

<style lang="stylus">

@import "../../assets/stylus/_variables"

$easeIm = cubic-bezier(0.455, 0.03, 0.515, 0.955)

.plax-image {
  // position relative
  // width 100%
  transform translateZ(0)

  .plax-in {
    background $bg
    overflow hidden
    position relative
    transform translateZ(0)
  }

  .plax-spacer {
    height 0
    padding-bottom (1200 / 800 * 100%)
    position relative
    transform translateZ(0)
    width 100%
  }

  .plax-im {
    abs()
    transition opacity $beat $easeOutSoft

    img {
      abs()
      height auto
      object-fit: cover
    }

    .img {
      transition transform $beat * 2 $easeOutSoft
      transform scale(1)
    }

    opacity 1

    &.v-enter,
    &.v-leave-to {
      opacity 0
    }

    .alt-hover {
      opacity 0
      abs()
      transition opacity $beat $easeIm
    }

    button:hover &,
    button:focus & {
      .alt-hover {
        +above($tablet) {
          opacity 1
        }
      }
    }

    .zooming & {
      .alt-hover {
        opacity 0
      }
    }
  }
}

.dark-ui {
  .plax-in {
    background lighten($black, 1%)
  }
}
</style>
