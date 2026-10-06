<script setup>
import { components } from '../slices/index'
const { client } = usePrismic()
const { data: page } = await useLazyAsyncData('home', () => client.getByUID('page', 'home'))
</script>

<template>
  <div class="main">
    <SliceZone v-if="page?.data" :slices="page.data.body" :components="components" />
  </div>
</template>
