<template>
  <div class="gallery-index">
    <div class="wrap">
      <div
        v-for="(im, idx) in images"
        :id="$prismic.richTextAsPlain(im.caption)"
        :key="idx"
        :class="[ 'image', { zooming: zooming === idx }]"
      >
        <div class="content">
          <button
            type="button"
            title="Open image gallery"
            @click.left="openGallery(idx, $event)"
          >
            <modules-plax-image
              :src="im.src"
              :alt="im.alt"
              :scroll="scroll"
              :inview="inview"
              :p-top="elTop"
              :img-obj="im.obj"
            />
          </button>

          <prismic-rich-text
            v-if="im.caption"
            class="caption"
            :field="im.caption"
          />
        </div>
      </div>
    </div>

    <gallery-video
      v-if="data && data.video_src && data.video_src.url"
      :data="data"
      :scroll="scroll"
    />

    <div
      v-if="copy && copy.length > 0"
      class="copy"
    >
      <prismic-rich-text :field="copy" />
    </div>

    <modules-zoom-overlay
      ref="overlay"
      :content="galleries[galleryIdx]"
      @closeGallery="closeGallery"
      @prevSet="prevSet"
      @nextSet="nextSet"
    />
  </div>
</template>

<script>

import { mapActions } from 'pinia';
import { useUiStore } from '~~/stores/ui';

// import cmsProps from '../mixins/cms-props.js';
// import parallax from '../mixins/parallax.js';

// import GalleryVideo from '../sections/GalleryVideo.vue';
// import ZoomOverlay from '../modules/ZoomOverlay.vue';

export default {

  // components: {
  //   GalleryVideo,
  //   ZoomOverlay
  // },

  // mixins: [
  //   cmsProps,
  //   parallax
  // ],

  data() {
    return {
      galleryIdx: 0,
      zooming: -1,
      galleries: [],
      images: []
    };
  },

  watch: {
    items: {
      immediate: true,
      handler(items) {

        if (items && items.length && items[0].image && items[0].image.url) {
          this.images = items.map((item) => {
            return {
              src: item.image.url,
              alt: item.alt_image && item.alt_image.url ? item.alt_image.url : null,
              caption: item.caption && item.caption.length ?
                item.caption : null,
              obj: this.mobile ? item.image.Mobile : item.image
            };
          });

          this.galleries = this.extractGalleries(items);
        }

      }
    }
  },

  mounted() {
    if (this.$route?.hash) {
      setTimeout(this.findDress(this.$route.hash), 650);
    }
  },

  methods: {
    ...mapActions(useUiStore, [
      'toggleGallery'
    ]),

    extractGalleries(items) {

      const galleries = [];

      items.forEach((item, idx) => {

        const images = [
          item.image.url
        ];

        if (item.alt_image?.url) {
          images.push(item.alt_image.url);
        }
        if (item.alt_image_2?.url) {
          images.push(item.alt_image_2.url);
        }
        if (item.alt_image_3?.url) {
          images.push(item.alt_image_3.url);
        }
        if (item.alt_image_4?.url) {
          images.push(item.alt_image_4.url);
        }

        let section;

        if (this.header && this.header.data.headline) {
          section = this.$prismic.richTextAsPlain(this.header.data.headline);
        }

        galleries.push({
          section: section,
          images: images,
          headline: this.$prismic.richTextAsPlain(item.caption),
          copy: item.blurb,
          gidx: idx,
          objs: [
            item.image,
            item.alt_image,
            item.alt_image_2,
            item.alt_image_3,
            item.alt_image_4
          ]
        });
      });

      return galleries;

    },

    openGallery(idx, e) {
      const top = e.target.offsetTop + this.$el.offsetTop - this.scroll;

      this.galleryIdx = idx;
      this.zooming = idx;
      this.$nextTick(this.$refs.overlay.setScale(e, top));
    },

    closeGallery() {
      this.toggleGallery(false);
      this.galleryIdx = -1;
      this.zooming = -1;
      this.$nextTick(this.$refs.overlay.open = false);
    },

    prevSet() {
      if (this.galleryIdx - 1 < 0) {
        this.closeGallery();
        return;
      }

      this.galleryIdx--;
    },

    nextSet() {
      if (this.galleryIdx + 1 > this.images.length) {
        this.closeGallery();
        return;
      }

      this.galleryIdx++;
    },

    findDress(hash) {
      hash = hash.slice(1);
      document.getElementById(hash).scrollIntoView();
    }
  }

};

</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.gallery-index {
  position relative
  pad(0, 0, 5)

  +above($tablet) {
    pad(3, 1, 5)

    .basic-hero + & {
      pad(1, 1, 5)
    }
  }

  .wrap {
    display flex
    flex-wrap wrap

    +below($tablet) {
      align-items center
      justify-content space-between

      &::before,
      &::after {
        content none
      }
    }
  }

  .gallery-video {
    .six-ten-col {
      +above($tablet) {
        mgn(1, auto, 1)
      }
    }
  }

  .image {
    opacity 1
    transition opacity $beat $easeOutCubic

    .content  {
      width 100%
    }

    &.zooming {
      opacity 0
    }

    button {
      cursor pointer
      display block
      width 100%

      .plax-image {
        pointer-events none
      }
    }

    +above($tablet) {
      col(3, 10)
      pad(2, .5)
      display flex

      .content {
        margin auto
      }

      &:nth-of-type(6n - 4) {
        display flex
        col(2, 10)
        pad(2, .5)
        margin 0 10%
      }

      &:nth-of-type(6n - 2) {
        display flex
        col(2, 10)
        pad(2, .5)
        margin 0 10% 0 5%
      }

      &:nth-of-type(6n) {
        display flex
        col(2, 10)
        margin 0 5% 0 10%
      }
    }

    +below($tablet) {
      col(3, 6)
      pad(1, .5)

      &:nth-of-type(4n - 2) {
        col(2, 6)
      }

      &:nth-of-type(4n - 1) {
        col(2, 6)
      }

      &:nth-of-type(4n) {
        col(3, 6)
      }
    }
  }

  .caption {
    margin-top 6px

    +above($tablet) {
      margin-top 19px
    }

    h3 {
      label()
      margin 0
    }

    h4 {
      display2()
      margin 8px 0

      ~ p {
        color lighten($black, 40%)
      }
    }

    p {
      label()
      margin 0
    }
  }

  .copy {
    pad(2, 0)

    p {
      text-align center
      mgn(1, auto)
    }

    a {
      label()
      underline()
    }
  }
}

</style>
