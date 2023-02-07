<script setup>
import { components } from '../slices/index'
// eslint-disable-next-line no-undef
const { client } = usePrismic()
// eslint-disable-next-line no-undef
const { data: page } = await useLazyAsyncData('home', () => client.getByUID('page', 'home'))
</script>

<template>
  <div class="main">
    <SliceZone
      v-if="page?.data"
      :slices="page.data.body"
      :components="components"
    />
  </div>
</template>
