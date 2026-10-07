<template>
  <div class="post-index">
    <div
      :class="[
        'filters',
        filterFix ? 'scroll' : 'fix',
        filtersOpen ? 'filters-open' : 'filters-closed',
      ]"
    >
      <form>
        <fieldset>
          <div class="filter-fieldset">
            <div class="filter-legend">
              <legend>Filter</legend>
            </div>
            <div class="filter-options">
              <div v-for="tag in allTags" :key="safeTag(tag)">
                <input
                  :id="safeTag(tag)"
                  v-model="filters"
                  type="checkbox"
                  :value="tag"
                  name="filters"
                />
                <label :for="safeTag(tag)" v-html="tag" />
              </div>
            </div>
          </div>
        </fieldset>
      </form>
    </div>

    <div
      :class="[
        'filters-toggle',
        filterFix ? 'scroll' : 'fix',
        filtersOpen ? 'toggle-open' : 'toggle-closed',
      ]"
    >
      <button type="button" @click.left="toggleFilters">
        <close />
        <span v-html="filtersOpen ? 'Close' : 'Filter'" />
      </button>
    </div>

    <div class="wrap">
      <div v-for="(im, idx) in filterImages" :key="idx" class="image">
        <div class="content">
          <button type="button" title="Open image gallery" @click.left="openGallery(im.gidx)">
            <!-- :src="im.src"
          :scroll="scroll"
          :inview="inview"
          :p-top="elTop" -->
            <modules-plax-image :img-obj="im.obj" />
          </button>

          <span class="label tag">{{ im.tag }}</span>

          <span v-if="im.caption" class="caption">{{ im.caption }}</span>

          <span class="label date">{{ im.date }}</span>
        </div>
      </div>
    </div>

    <gallery-overlay
      ref="overlay"
      :content="galleries[galleryIdx]"
      :zoom="false"
      @closeGallery="closeGallery"
      @prevSet="closeGallery"
      @nextSet="closeGallery"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { asText } from '@prismicio/client'

// import parallax from '../mixins/parallax'

import GalleryOverlay from '@/components/modules/GalleryOverlay.vue'
import Close from '@/components/svg/Close.vue'

export default {
  components: {
    GalleryOverlay,
    Close,
  },

  // mixins: [parallax],

  props: {
    ...getSliceComponentProps(['slice']),
    data: {
      type: Object,
      default: null,
    },

    items: {
      type: Array,
      default: null,
    },
  },

  data() {
    return {
      galleryIdx: -1,
      images: [],
      allTags: ['Real weddings', 'Media', 'Red carpet', 'Fashion shows'],
      filters: [],
      galleries: [],
      filterFix: false,
      filtersOpen: false,
    }
  },

  computed: {
    filterImages() {
      return this.images.filter((im) => !im.tag || this.filters.includes(im.tag))
    },
  },

  watch: {
    filterFix(fix) {
      if (fix) {
        this.filtersOpen = false
      }
    },
  },

  created() {
    // .query(this.$prismic.Predicates.at('document.type', 'post'), {
    //   orderings: '[my.post.date desc]',
    //   pageSize: 50,
    // })
    this.$prismic.client.getByType('post').then((res) => {
      this.extract(res.results)
    })
  },

  methods: {
    safeTag(tag) {
      return tag.toLowerCase().replace(/\s/g, '-')
    },

    extract(items) {
      const tags = []
      const images = []
      const galleries = []

      items.forEach((item, idx) => {
        images.push({
          gidx: idx,
          src: item.data.image.url,
          tag: item.tags.length ? item.tags[0] : null,
          caption: asText(item.data.headline),
          date: dayjs(item.data.date).format('MMM D, YYYY'),
          obj: item.data.image,
        })

        galleries.push({
          section: item.tags.length ? item.tags[0] : null,
          images: [item.data.image.url].concat(item.data.alt_images.map((i) => i.alt_image.url)),
          headline: asText(item.data.headline),
          blurb: item.data.blurb,
          zoomImages: null,
          objs: [item.data.image].concat(item.data.alt_images.map((i) => i.alt_image)),
        })

        if (item.tags.length && tags.indexOf(item.tags[0]) < 0) {
          tags.push(item.tags[0])
        }
      })

      this.allTags = tags
      this.filters = tags
      this.images = images
      this.galleries = galleries
    },

    openGallery(idx) {
      this.galleryIdx = idx
      this.$nextTick(this.$refs.overlay.openGallery)
    },

    closeGallery() {
      this.galleryIdx = -1
      this.$nextTick((this.$refs.overlay.open = false))
    },

    toggleFilters() {
      this.filtersOpen = !this.filtersOpen
    },
  },
}
</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.post-index {
  overflow hidden
  position relative

  +above($tablet) {
    pad(0, 1, 7)
  }

  .wrap {
    +above($tablet) {
      display flex
      flex-wrap wrap
    }
  }

  .image {
    col(5, 6)

    button {
      cursor pointer
    }

    .content, button {
      width 100%
    }

    +above($tablet) {
      col(3, 10)

      &:nth-of-type(7n + 1) {
        margin 0 0 0 20%
        col(4, 10)
      }

      &:nth-of-type(7n + 2) {
        margin 20% 0 0 10%
      }

      &:nth-of-type(7n + 5),
      &:nth-of-type(7n + 7) {
        margin -10% 0 0 20%
      }

      &:nth-of-type(7n + 3) {
        margin 0 0 0 20%

        button {
          width 75%
        }
      }

      &:nth-of-type(7n + 4) {
        col(4, 10)
        margin 20% 0% 0 10%
      }

      &:nth-of-type(7n + 5) {
        button {
          width 75%
        }
      }

      &:nth-of-type(7n + 6) {
        margin 20% 0 0 10%

        button {
          width (200% / 3)
        }
      }

      &:nth-of-type(7n + 5),
      &:nth-of-type(7n + 7) {
        col(4, 10)
      }
    }

    +below($tablet) {
      &:nth-child(3n + 1) {
        margin 0 0 $let * 3rem (100 / 6%)
      }

      &:nth-child(3n + 2) {
        col(4, 6)
        margin 0 0 $let * 3rem (200 / 6%)
      }

      &:nth-child(3n + 3) {
        col(4, 6)
        margin 0 (100 / 6%) $let * 3rem
      }
    }
  }

  span {
    display block
    font-smoothing()
  }

  .tag {
    line-height 1
    mgn(.75, 0, .5)

    +above($tablet) {
      mgn(1, 0, .5)
    }
  }

  .caption {
    display2()
  }

  .date {
    opacity .6
    line-height 1
    margin 10px 0 0
  }

  .filters {
    bottom $gut * 3rem
    left $gut * 2rem
    position fixed

    +below($tablet) {
      background $w
      border-top 1px solid #dedede
      bottom 0
      padding 28px 20px 38px
      left 0
      pointer-events none
      transform translateY(100%) translateZ(0)
      transition opacity $beat $easeOutCubic
      transition-property opacity, transform
      width 100%
      z-index 1

      &.filters-open {
        transform translateY(0%) translateZ(0)
        pointer-events auto
      }
    }

    +above($tablet) {
      &.scroll {
        position absolute
      }
    }
  }

  .filters-toggle {
    +above($tablet) {
      opacity 0
      pointer-events none
    }

    +below($tablet) {
      bottom 40px
      left 20px
      position fixed
      transform-origin center left
      z-index 2

      &, svg {
        transition transform $beat $easeOutCubic
      }

      svg, span {
        display inline-block
        vertical-align middle
      }

      svg {
        height 12px
        stroke $black
        margin-right 6px
        width 12px
      }

      button {
        label()
      }

      &.toggle-open {
        transform rotateZ(0deg)

        svg {
          transform rotateZ(0deg)
        }
      }

      &.toggle-closed {
        transform rotateZ(-90deg)

        svg {
          transform rotateZ(45deg)
        }
      }

      &.scroll {
        position absolute
      }
    }
  }

  .filter-fieldset {
    +below($tablet) {
      display flex
    }
  }

  .filter-legend,
  .filter-options {
    +below($tablet) {
      width 50%
    }
  }

  .filters {
    fieldset {
      border 0
      margin 0
      padding 0
    }

    legend {
      display2()

      +above($tablet) {
        mgn(.5, 0)
      }
    }

    input,
    label {
      display inline-block
      vertical-align middle
    }

    input {
      background $w
      border 6px solid $w
      border-radius 9px
      height 18px
      margin (1 / 14em) 0 0 -5px
      width 18px

      +above($tablet) {
        margin (7 / 14em) 0 0 -5px
      }

      &:checked {
        background $black
      }

      &:not(:checked) {
        + label {
          opacity .25
        }
      }
    }

    label {
      label()
      enterline()
      mgn(.3, 0)

      +above($tablet) {
        mgn(.5, 0)
      }

      &::after {
        bottom (-3 / 14em)
      }
    }
  }

  .plax-in {
    &:hover {
      img {
        transform scale(1.05)
      }
    }
  }
}
</style>
