<template>
  <div class="sniffer" />
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, watch } from 'vue'
import { useDeviceStore } from '@/stores/device'

const deviceStore = useDeviceStore()

const device = reactive({
  win: {
    x: 1440,
    y: 900,
  },
  mouse: false,
  portrait: false,
})

watch(
  device,
  () => {
    deviceStore.updateDevice({
      win: {
        x: device.win.x,
        y: device.win.y,
      },
      mouse: device.mouse,
      portrait: device.portrait,
    })
  },
  { immediate: true },
)

function mousestart() {
  device.mouse = true
  window.removeEventListener('mousemove', mousestart, { passive: true })
}

function resize() {
  device.win = {
    x: window.innerWidth,
    y: window.innerHeight,
  }
  device.portrait = window.innerWidth < window.innerHeight
}

onMounted(() => {
  window.addEventListener('mousemove', mousestart, { passive: true })
  window.addEventListener('resize', resize, { passive: true })
  resize()
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', mousestart, { passive: true })
  window.removeEventListener('resize', resize, { passive: true })
})
</script>

<style lang="stylus">

.sniffer {
  display none
  pointer-events none
}
</style>
