<script setup>
import { useDeviceStore } from '@/stores/device'
const deviceStore = useDeviceStore()
const { mobile } = storeToRefs(deviceStore)
import Sniffer from '@/components/app/Sniffer.vue'
import Header from '@/components/app/Header.vue'
import HeaderMobile from '@/components/app/HeaderMobile.vue'
</script>

<template>
  <Sniffer />
  <div class="app">
    <Header />
    <HeaderMobile v-if="mobile" />
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
