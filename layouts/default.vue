<script setup>
import { useDeviceStore } from '@/stores/device'
const deviceStore = useDeviceStore()
const { mobile } = storeToRefs(deviceStore)
import Header from '@/components/app/Header.vue'
import HeaderMobile from '@/components/app/HeaderMobile.vue'
import Footer from '@/components/app/Footer.vue'
</script>

<template>
  <Header v-if="!mobile" />
  <HeaderMobile v-else />
  <slot />
  <Footer />
</template>

<style lang="stylus">

@import "../assets/stylus/_variables"

.page {
  height 100%
}
</style>
