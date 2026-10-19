<script setup>
import { components } from '../slices/index'
const { client } = usePrismic()
const { data: page } = await useLazyAsyncData('home', () => client.getByUID('page', 'home'))
const uiStore = useUiStore()
const { setLightUi } = uiStore
onMounted(() => {
  setLightUi(true)
})
</script>

<template>
  <div class="main">
    <SliceZone v-if="page?.data" :slices="page.data.body" :components="components" />
  </div>
</template>
