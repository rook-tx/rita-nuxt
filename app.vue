<template>
  <app-sniffer />
  <div class="app">
    <app-header />
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
