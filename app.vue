<script setup>
import Sniffer from '@/components/app/Sniffer.vue'
import { useUiStore } from '@/stores/ui'
const uiStore = useUiStore()
const { lightUi } = storeToRefs(uiStore)
</script>

<template>
  <Sniffer />
  <div :class="['app', `${lightUi ? 'light' : 'dark'}-ui`]">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="stylus">

@import "./assets/stylus/main"

.app {
  transition color 2s $easeInOutSoft, background $beat * 1.5 $easeInOutSoft

  &.light-ui {
    background $w
    color $black
  }

  &.dark-ui {
    background $black
    color $w
  }
}
</style>
