<script setup>
import { useDeviceStore } from '@/stores/device'
const deviceStore = useDeviceStore()
const { mobile } = storeToRefs(deviceStore)
import Header from '@/components/app/Header.vue'
import HeaderMobile from '@/components/app/HeaderMobile.vue'
</script>

<template>
  <Header v-if="!mobile" />
  <HeaderMobile v-if="mobile" />
  <div class="page">
    <slot />
    <app-footer />
  </div>
</template>

<style lang="stylus">

@import "../assets/stylus/_variables"

.page {
  height 100%
}
</style>
