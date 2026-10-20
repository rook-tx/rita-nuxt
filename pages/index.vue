<script setup>
import { components } from '../slices/index'
import { isFilled, asText } from '@prismicio/client'
const { client } = usePrismic()
const { data: page } = await useAsyncData('home', () => client.getByUID('page', 'home'))
const uiStore = useUiStore()
const { setLightUi } = uiStore

const metaTitle = page.value.data.meta_title
  ? page.value.data.meta_title
  : asText(page.value.data.page_title)
if (metaTitle) {
  useSeoMeta({
    title: metaTitle,
    ogTitle: metaTitle,
  })
}

const metaDescription = page.value.data.meta_description
if (metaDescription) {
  useSeoMeta({
    description: metaDescription,
    ogDescription: metaDescription,
  })
}

const metaImage = isFilled.image(page.value.data.open_graph_image)
  ? page.value.data.open_graph_image.url
  : ''
if (metaImage) {
  useSeoMeta({
    ogImage: metaImage,
  })
}

onMounted(() => {
  setLightUi(true)
})

</script>

<template>
  <div class="main">
    <SliceZone v-if="page?.data" :slices="page.data.body" :components="components" />
  </div>
</template>
