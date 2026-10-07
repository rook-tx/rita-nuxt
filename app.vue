<script setup>
import Sniffer from '@/components/app/Sniffer.vue'
</script>

<template>
  <Sniffer />
  <div class="app">
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
