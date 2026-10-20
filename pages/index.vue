<script setup>
import { components } from '../slices/index'
const { client } = usePrismic()
const { data: page } = await useLazyAsyncData('home', () => client.getByUID('page', 'home'))
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
  setLightUi(true)
})
</script>

<template>
  <div class="main">
    <SliceZone v-if="page?.data" :slices="page.data.body" :components="components" />
  </div>
</template>
