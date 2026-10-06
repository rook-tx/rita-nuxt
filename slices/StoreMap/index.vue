<template>
  <leaflet-map ref="leaflet" :prop-items="slice.items" @ready="initMap" />
</template>

<script>
import LeafletMap from '@/components/modules/LeafletStoreMap.vue'

export default {
  components: {
    LeafletMap,
  },

  props: {
    ...getSliceComponentProps(['slice']),
    items: {
      type: Array,
      default: Array,
    },
  },

  methods: {
    initMap() {
      this.$nextTick(() => {
        this.$refs.leaflet.init()
      })
    },
  },
}
</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.store-map {
  .ratio {
    mgn(1, 0)
  }
}
</style>
