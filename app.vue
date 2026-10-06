<script setup>
import { useDeviceStore } from '@/stores/device'
const deviceStore = useDeviceStore()
const { mobile } = storeToRefs(deviceStore)
</script>

<template>
  <app-sniffer />
  <div class="app">
    <app-header-mobile v-if="mobile" />
    <app-header v-else />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="stylus">

@import "./assets/stylus/main"

.app {
  height 100%
}
</style>
