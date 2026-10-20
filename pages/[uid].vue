<script setup>
import { onMounted } from 'vue'
import { useUiStore } from '@/stores/ui'
import { components } from '../slices/index'
import { isFilled } from '@prismicio/client'
const { client } = usePrismic()
const uid = useRoute().params.uid ? String(useRoute().params.uid) : 'home'
const { data: page } = await useAsyncData(uid, () => client.getByUID('page', uid))
const uiStore = useUiStore()
const { setLightUi } = uiStore

const metaTitle = page.value.data.meta_title
  ? page.value.data.meta_title
  : asText(page.value.data.page_title)

const metaDescription = page.value.data.meta_description
const metaImage = isFilled.image(page.value.data.open_graph_image)
  ? page.value.data.open_graph_image.url
  : ''

useSeoMeta({
  title: metaTitle,
  ogTitle: metaTitle,
  description: metaDescription,
  ogDescription: metaDescription,
  ogImage: metaImage,
})

onMounted(() => {
  setLightUi(uid !== 'bespoke')
})
</script>

<template>
  <div class="main">
    <SliceZone v-if="page?.data" :slices="page.data.body" :components="components" />
  </div>
</template>
