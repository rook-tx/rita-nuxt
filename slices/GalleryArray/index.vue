<template>
  <div :class="[ 'gallery-array', `layout-${layout}` ]">
    <div class="wrap">
      <div class="copy">
        <prismic-rich-text
          :field="slice.primary.copy"
        />
      </div>

      <div
        v-for="(im, idx) in images"
        :key="idx"
        class="image"
      >
        <button
          type="button"
          aria-label="Open image gallery"
          @click.left.prevent="openGallery(idx, $event)"
        >
          <plax-image
            :src="im.src"
            :alt="im.alt"
            :p-top="elTop"
            :scroll="scroll"
            :inview="inview"
            :img-obj="im.obj"
          />
        </button>

        <div
          class="caption"
        >
          <prismic-rich-text
            v-if="im.caption"
            :field="im.caption"
          />

          <prismic-rich-text
            v-if="im.season"
            :field="im.season"
          />

          <prismic-rich-text
            v-if="im.collection"
            :field="im.collection"
          />
        </div>
      </div>
    </div>

    <!-- <zoom-overlay
      ref="overlay"
      :content="galleries[galleryIdx]"
      @closeGallery="closeGallery"
      @prevSet="prevSet"
      @nextSet="nextSet"
    /> -->
  </div>
</template>

<script>

import { getSliceComponentProps } from '@prismicio/vue';

import PlaxImage from '~~/components/modules/PlaxImage.vue'

export default {
  props: getSliceComponentProps(['slice', 'index', 'slices', 'context']),

  components: {
    PlaxImage
  },

  data() {
    return {
      images: [],
      copy: null,
      layout: 'left',
      galleryIdx: 0,
      zooming: -1,
      galleries: []
    };
  },
}

</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.gallery-array {
  position relative

  +above($tablet) {
    pad(5, 1, 7)
  }

  .wrap {
    display flex
    flex-wrap wrap
  }

  .copy {
    mgn(0, 0, 2)
    col(5, 6)

    +above($tablet) {
      margin 10% 10% 0
      col(4, 10)
    }

    // +below($tablet) {
    //   order 2
    // }

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
      cursor pointer
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
      mgn(0, 0, 2)

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

    h2, p {
      label()

      +below($tablet) {
        mgn(.5, 0, 0)
      }
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
  