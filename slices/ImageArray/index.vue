<template>
  <div :class="['image-array', `layout-${layout}`]">
    <div class="wrap">
      <div class="copy">
        <prismic-rich-text v-if="copy && copy.constructor === Array" :field="copy" />
        <p v-else-if="copy" v-html="copy" />
      </div>

      <div v-for="(im, idx) in slice.items" :key="idx" class="image">
        <button type="button" title="Open image gallery" @click.left="openGallery(idx, $event)">
          <!-- :src="im.src"
          :scroll="scroll"
          :inview="inview"
          :p-top="elTop" -->
          <modules-plax-image :img-obj="im.image" />
        </button>

        <div class="caption">
          <prismic-rich-text v-if="im.name" :field="im.name" />

          <prismic-rich-text v-if="im.season" :field="im.season" />

          <prismic-rich-text v-if="im.caption" :field="im.caption" />
        </div>
      </div>
    </div>

    <!-- <zoom-overlay
      ref="overlay"
      :content="galleries[galleryIdx]"
      @closeGallery="closeGallery"
      @nextSet="nextSet"
    /> -->
  </div>
</template>

<script>
import { getSliceComponentProps } from '@prismicio/vue'
import { asText } from '@prismicio/client'

// import parallax from '../mixins/parallax.js'

// import ZoomOverlay from '../modules/ZoomOverlay.vue'

export default {
  // components: {
  //   ZoomOverlay,
  // },

  props: {
    ...getSliceComponentProps(['slice']),

    header: {
      type: Object,
      default: null,
    },

    data: {
      type: Object,
      default: null,
    },

    items: {
      type: Array,
      default: null,
    },

    scroll: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      images: [],
      copy: '',
      layout: 'left',
      galleryIdx: 0,
      zooming: -1,
      galleries: [],
    }
  },

  watch: {
    slice: {
      immediate: true,
      handler(slice) {
        if (slice) {
          const { items, primary: data } = slice

          this.headline = data.headline && data.headline.length ? data.headline : this.headline

          this.copy = data.copy && data.copy.length ? data.copy : this.copy

          this.src =
            data.image && data.image.url && this.mobile
              ? data.image.Mobile.url
              : data.image && data.image.url && !this.mobile
                ? data.image.url
                : this.src

          this.layout =
            data.layout && data.layout.length
              ? data.layout.toLowerCase().replace(/\s/g, '-')
              : this.layout

          this.mapItems(items)
        }
      },
    },

    items: {
      immediate: true,
      handler(items) {
        this.mapItems(items)
      },
    },
  },

  methods: {
    mapItems(items) {
      if (items && items.length && items[0].image && items[0].image.url) {
        this.images = items.map((item) => {
          return {
            src: item.image.url,
            name: item.name && item.name.length ? item.name : null,
            season: item.season && item.season.length ? item.season : null,
            caption: item.caption && item.caption.length ? item.caption : null,
          }
        })

        this.galleries = this.extractGalleries(items)
      }
    },

    extractGalleries(items) {
      const galleries = []

      const images = []
      const zoomImages = []

      let section
      let caption

      items.forEach((item) => {
        images.push(item.image.url)
        zoomImages.push(item.image.url)

        if (item.caption && item.caption.length) {
          caption = item.caption
        }

        if (item.season && item.season.length) {
          section = item.season
        }
      })

      galleries.push({
        section: asText(section),
        images: images,
        headline: asText(caption),
        copy: caption,
      })

      return galleries
    },

    openGallery(idx, e) {
      const top = e.target.offsetTop + this.$el.offsetTop - this.scroll

      this.$refs.overlay.displayIdx = idx

      this.$nextTick(() => {
        this.galleryIdx = 0
        this.zooming = 0
        this.$refs.overlay.setScale(e, top)
      })
    },

    closeGallery() {
      this.galleryIdx = -1
      this.zooming = -1
      this.$nextTick((this.$refs.overlay.open = false))
    },

    nextSet() {
      if (this.galleryIdx + 1 > 0) {
        this.closeGallery()
        return
      }

      this.galleryIdx++
    },
  },
}
</script>

<style lang="stylus">

@import "../../assets/stylus/_variables.styl"

.image-array {
  position relative
  pad(0, 0, 4)

  +above($tablet) {
    pad(5, 1, 7)
  }

  .wrap {
    display flex
    flex-wrap wrap
  }

  .copy {
    mgn(0, 0, 1.5)
    col(5, 6)

    +above($tablet) {
      margin 10% 10% 0
      col(4, 10)
    }

    p {
      body1()
    }

    a {
      label()
      underline()
    }
  }

  .image {
    col(5, 6)

    &-in {
      overflow hidden
    }

    button {
      display block
      width 100%

      .plax-image {
        pointer-events none
      }
    }

    img {
      transform-origin center
      width 100%
    }

    +below($tablet) {
      mgn(0, 0, 3)

      &:nth-of-type(2) {
        // order 1
        margin-left (100% / 6)
      }

      &:nth-of-type(3) {
        // order 3
      }

      &:nth-of-type(4) {
        // order 4
        margin-left (100% / 6)
      }
    }

    +above($tablet) {
      col(4, 10)

      &:nth-of-type(2) {

      }

      &:nth-of-type(3) {
        margin $let * -4.5em 0 0
        col(3, 10)
      }

      &:nth-of-type(4) {
        margin $let * 6em 10% 0
      }
    }
  }

  .caption {
    display flex
    justify-content space-between

    h3, p {
      label()
    }
  }

  &.layout-right {
    +below($tablet) {
      .image {
        &:nth-of-type(2) {
          margin-left 0
          margin-right (100% / 6)
        }

        &:nth-of-type(3) {
          margin-left (200% / 6)
          col(4, 6)
          order 3
        }

        &:nth-of-type(4) {
          margin-left 0
          margin-right (100% / 6)
        }
      }
    }

    +above($tablet) {
      .copy {
        order 2
      }

      .image {
        &:nth-of-type(2) {
          order 1
        }

        &:nth-of-type(3) {
          order 3
          margin 10% 10% 0 20%
          col(4, 10)
        }

        &:nth-of-type(4) {
          order 4
          margin -10% 0 0
          col(3, 10)
        }
      }
    }
  }
}
</style>
