<script setup>
import { onMounted } from 'vue'
import { useUiStore } from '@/stores/ui'
import { components } from '../slices/index'
const { client } = usePrismic()
const uid = useRoute().params.uid ? String(useRoute().params.uid) : 'home'
const { data: page } = await useAsyncData(uid, () => client.getByUID('page', uid))
const uiStore = useUiStore()
const { setLightUi } = uiStore
onMounted(() => {
  setLightUi(uid !== 'bespoke')
})
</script>

<template>
  <div class="main">
    <SliceZone v-if="page?.data" :slices="page.data.body" :components="components" />
  </div>
</template>
