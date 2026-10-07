<template>
  <div class="map">
    <div class="windows">
      <div class="window locations-window">
        <div class="locations">
          <h2 class="display2">Find a store near you</h2>
          <p class="body2">
            Stock availability varies from store to store.<br />
            Please contact the store directly to inquire.
          </p>
          <div>
            <div class="form-row">
              <form @submit.prevent="goSearch(search)">
                <input
                  id="searchInput"
                  v-model="search"
                  type="search"
                  :class="['form-row-input', { full: search }]"
                  autocomplete="off"
                  placeholder="Enter your street, zone, or postcode"
                />
                <label for="searchInput">Enter your street, zone, or postcode</label>
                <button type="submit">Search</button>
              </form>
            </div>
            <div ref="results" />
            <div v-if="closest < 0 && search" class="results">No results</div>
            <div v-else-if="closest > -1 && closestStores.length > 0" class="results">
              <div class="results-key">
                {{ closestStores.length }} results found{{
                  safeTerm ? ` near “${safeTerm}”` : null
                }}
              </div>
              <ul>
                <li v-for="(cStore, idx) in closestStores" :key="cStore.name" ref="store">
                  <div>
                    <button
                      type="button"
                      class="open-details"
                      @click.left="popupMarker(cStore.name, idx + 1)"
                    >
                      <prismic-rich-text :field="cStore.item.name" />
                    </button>
                    <div class="details">
                      <prismic-rich-text :field="cStore.item.description" />
                      <a
                        :href="`https://maps.google.com/maps?daddr=(${cStore.latlng.join(',')})`"
                        target="_blank"
                        rel="noopener"
                      >
                        Get directions
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="window map-window">
        <div class="ratio">
          <div id="mapid" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// require('leaflet-geometryutil')
// require('../../js/cms.js')
import { useRuntimeConfig } from '#app'

export default {
  props: {
    propItems: {
      type: Array,
      default: Array,
    },
  },

  data() {
    return {
      // map: null,
      search: null,
      safeTerm: null,
      stores: [],
      storePoints: [],
      closest: null,
      closestStores: [],
      // zoom: 12,
      // items: []
    }
  },

  beforeDestroy() {
    if (this.map) {
      this.map.off()
      this.map.remove()
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.getContent('find-store')
    },

    getContent(slug) {
      if (this.propItems && this.propItems.length > 1) {
        this.items = this.propItems

        this.initMap()

        return
      }

      this.$prismic.client.getByUID('page', slug).then((document) => {
        this.items = document.data.body.find((s) => {
          return s.slice_type === 'store_map'
        }).items

        this.initMap()
      })
    },

    /* eslint-disable */

    initMap() {
      if (typeof L === 'undefined') {
        console.warn('Leaflet library is not loaded')
        return
      }
      const map = L.map('mapid').setView([43.65, -79.38], 12)

      const config = useRuntimeConfig()

      L.tileLayer(
        `https://api.mapbox.com/styles/v1/rookdesign/ckc3plz6q12l41iqcju9e45dt/tiles/256/{z}/{x}/{y}@2x?access_token=${config.public.MAPBOX_ACCESS_TOKEN}`,
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          minZoom: 2,
          maxZoom: 14,
        },
      ).addTo(map)

      this.map = map

      this.addMarkers(this.items)

      this.addSearch()
    },

    addMarkers(items) {
      items.forEach((item, idx) => {
        var latlng = [item.store.latitude, item.store.longitude]

        this.storePoints.push(latlng)

        var marker = L.marker(latlng, {
          title: String(idx + 1),
          icon: L.icon({
            iconUrl: '/static/blank-pin.png',
            iconSize: [24, 24],
          }),
        })
          .addTo(this.map)
          .bindPopup(String(1))

        marker.on('click', () => {
          this.closestStores = [this.stores[idx]]
        })

        this.stores.push({
          name: idx,
          latlng: latlng,
          marker: marker,
          item: {
            name: item.name,
            description: item.description,
          },
        })
      })
    },

    addSearch() {
      const results = this.$refs.results

      this.service = new google.maps.places.PlacesService(results)
    },

    goSearch(term) {
      const query = {
        query: term,
        fields: ['name', 'geometry'],
      }

      this.service.findPlaceFromQuery(query, (res) => {
        if (res && res.length > 0) {
          this.setMap(res)
        }
      })
    },

    setMap(res) {
      if (this.searchMarker) {
        this.map.removeLayer(this.searchMarker)
      }

      if (this.closestMarker) {
        this.closestMarker.closePopup()
      }

      const loc = res[0].geometry.location

      const latlng = [loc.lat(), loc.lng()]

      this.map.flyTo(latlng, 12)

      this.addSearchIcon(res, latlng)

      this.getClosest(res, latlng)
    },

    comparePoint(point, search) {
      const normalise = (float) => {
        return Math.round(float * 1000)
      }

      return (
        normalise(point[0]) === normalise(search.lat) &&
        normalise(point[1]) === normalise(search.lng)
      )
    },

    addSearchIcon(res, latlng) {
      var gIcon = L.icon({
        iconUrl: '/static/pin.png',
        iconSize: [30, 30],
      })

      this.searchMarker = L.marker(latlng, { icon: gIcon }).addTo(this.map).bindPopup(res[0].name)

      this.safeTerm = res[0].name
    },

    getClosest(res, latlng) {
      console.log(L.GeometryUtil)

      const closest = L.GeometryUtil.closest(this.map, this.storePoints, latlng, true)

      this.closest = this.storePoints.findIndex((p) => {
        return this.comparePoint(p, closest)
      })

      const layer = []

      this.stores.forEach((store) => {
        layer.push(store.marker)
      })

      const layers = L.GeometryUtil.nClosestLayers(this.map, layer, latlng, 10)

      this.closestStores = layers.map((lay) => {
        const idxLayer = this.storePoints.findIndex((p) => {
          return this.comparePoint(p, lay.latlng)
        })

        return this.stores[idxLayer]
      })

      if (this.closest > -1) {
        var group = L.latLngBounds(latlng, closest)

        this.map.fitBounds(group, { maxZoom: 12 })

        this.closestMarker = this.stores[this.closest].marker
        this.closestMarker.bindPopup('1').openPopup()
      }
    },

    /* eslint-enable */

    popupMarker(idx, ridx) {
      const store = this.stores.find((s) => {
        return s.name === idx
      })

      store.marker.bindPopup(String(ridx)).openPopup()
    },
  },
}
</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.map {
  position relative
  width 100%
  z-index 0

  +above($tablet) {
    .windows {
      align-items flex-start
      display flex
      width 100%
    }

    .window {
      width 50%
    }
  }

  .map-window {
    order 1
  }

  .ratio {
    // background url(/static/map.png) no-repeat center
    // background-size cover
    background #d2d5d5
    padding-bottom 100%
    position relative

    #mapid {
      abs()
    }
  }

  .leaflet-container {
    font inherit
  }

  .leaflet-bottom.leaflet-right {
    padding-top 1em
    pointer-events auto

    .leaflet-control-attribution {
      transform translateY(100%)
    }

    &:hover {
      .leaflet-control-attribution {
        transform translateY(0%)
      }
    }
  }

  .leaflet-gac-wrapper {
    height: 30px;
  }

  .leaflet-control-container .leaflet-gac-control {
      width: 300px;
      height: 30px;
      padding: 0 7px;
      border-radius: 5px;
      border: 1px #d0d0d0 solid;
  }

  .leaflet-control-container .leaflet-right .leaflet-gac-control {
      position: absolute;
      right: 0;
      transition: width .3s ease .15s;
  }

  .leaflet-control-container .leaflet-gac-control:focus {
      outline: none;
  }

  .leaflet-control-container .leaflet-gac-search-btn {
      background: #fff;
      width: 30px;
      height: 30px;
      border-radius: 4px;
  }

  .leaflet-control-container .leaflet-gac-search-btn .leaflet-gac-search-icon {
      cursor: pointer;
      width: 100%;
      height: 100%;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABOUlEQVQ4T6XTLUgmQRgH8N+Ligd+FOu1ww+wKPhxlwxXxHYnqCAGQZtgMBgU4eWaXLhyCgYxiAYVk6igJotgEaNiNYgGL6kHJwOzsO+yGzw3zszzm5nnP1vyzq+UU9+JUbTiCWdYw13eXmmgCr8wlbPwERPYys6lgVA8jSvM4RQfMIQF1KIfR2kkAdpxiRv04CGzUx9OcI02/EvmE+AH5jGG9YK+bmMQ3TjPApsYQXPcJc+Ywc/Y4I0ssIpxdOCi4ATl2Ivv2M0Ck1jBImZzgOrYoxZ8xG0WqI9Hb4pX2UkhNViKMe5jIC+FMPYVezGu4xhjHb7hUyx6wXDeFRK0C79jlMnYX4SmhZfZiwok7ymHwpBGyPs5RnaPRhzicxopAop+sYAc4Av+BPStQIAbsByffPl/gIrTvQLbJDoR8K3H6QAAAABJRU5ErkJggg==") no-repeat center center;
  }

  .leaflet-control-container .leaflet-gac-hidden {
      opacity: 0;
      width: 0;
      height: 0;
      overflow: hidden;
      transition: width .3s ease .15s;
  }

  .leaflet-popup-content-wrapper {
    border-radius 12px
    text-align center
  }

  .leaflet-popup-content-wrapper, .leaflet-popup-tip {
    background: $black;
    color: $w;
    box-shadow: none;
  }

  .leaflet-popup-content {
    label()
    line-height 24px
    margin 0
    padding 0 7px
    min-width 24px
    white-space nowrap
    width auto !important

    +above($tablet) {
      line-height 24px
    }
  }

  .leaflet-popup-tip-container,
  .leaflet-container a.leaflet-popup-close-button {
    display none
  }

  .leaflet-popup {
    margin-bottom -5px
  }

  .leaflet-popup-content-wrapper {
    padding 0
  }

  .form-row {
    border-bottom 1px solid $black
    position relative

    label {
      position absolute
      opacity .60
      pointer-events none
    }

    &-input {
      body2()
      display block
      position relative
      white-space nowrap
      overflow hidden
      padding-right 6em
      width 100%

      &:focus,
      &.full {
        + label {
          opacity 0
        }

        &::placeholder {
          opacity .3
        }
      }

      &::placeholder {
        opacity 0
      }

      &:-internal-autofill-selected {
        background $w !important
      }
    }

    label {
      opacity .6
      body2()
      top 0
      left 0
      pointer-events none
      position absolute
    }

    button {
      label()
      top 0
      right 0
      position absolute
    }

    &-input,
    label,
    button {
      font-smoothing()
      line-height (18 + (12.5 * 2)) * 1px
    }

    &-input,
    label,
    button {
      line-height (18 + (12.5 * 2)) * 1px
    }

    &-input {
      white-space nowrap
      overflow hidden
      padding-right 6em
      width 100%

      &:focus,
      &.full {
        + label {
          opacity 0
        }

        &::placeholder {
          opacity .3
        }
      }

      &::placeholder {
        opacity 0
      }

      &:-internal-autofill-selected {
        background $w !important
      }
    }
  }

  .results {
    h3 {
      display2()
    }

    h4, p {
      body2()
    }

    ul {
      counter-reset result
    }

    li {
      pad(1, 0, 1, 1.5)
      position relative

      &::before {
        counter-increment result
        content counter(result)
        position absolute
        left 0
        label()
        top $let * 1rem

        +above($tablet) {
          fs(16)
          line-height (34 / 16)
        }
      }
    }
  }

  .open-details {
    text-align left
    padding 0
    margin 0

    h3 {
      margin 0
    }

    h4, p {
      display none
    }
  }

  .details {
    h3 {
      display none
    }

    h4 {
      margin 0
    }

    p a {
      text-decoration underline
    }

    a[target="_blank"] {
      label()
      extarrow()
    }

  }

  .results-key {
    body2()
    border-bottom 1px solid rgba($black, .12)
    mgn(2, 0, 0)
    pad(.5, 0)

    +above($tablet) {
      mgn(3, 0, 0)
    }
  }

  .locations-window {
    order 2

    +below($tablet) {
      min-height 13em
    }
  }

  .locations {
    mgn(1, 1)

    +above($tablet) {
      margin 0 20%
      col(3, 5)
    }
  }
}
</style>
