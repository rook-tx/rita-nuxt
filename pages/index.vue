<script setup>
import {components} from '../slices/index'
const { client } = usePrismic()
const uid = useRoute().params.uid ? String(useRoute().params.uid) : 'home';
console.log(uid)
const { data: page } = await useAsyncData('page', () => client.getByUID('page', uid))
</script>

<template>
  <div class="main">
    <SliceZone 
      v-if="page?.data"
      :slices="page.data.body"
      :components="components" />
  </div>
</template>
