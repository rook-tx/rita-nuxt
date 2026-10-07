<template>
  <div
    :class="[
      'gallery-overlay',
      'base-overlay',
      open ? 'open' : 'closed',
      showingZoom ? 'expanded' : 'collapsed',
    ]"
  >
    <div class="bg" />

    <div class="close">
      <button
        type="button"
        title="Close gallery"
        @mouseover="showBack = false"
        @click.left="closeGallery"
      >
        <close />
      </button>
    </div>

    <div class="content">
      <div v-if="mobile" class="mobile-headline">
        <h3 v-html="headline" />
      </div>

      <div class="back-zone" @mouseover="onBack" @mouseout="offBack">
        <button type="button" @click.left="prev">Back</button>
      </div>

      <div class="ims" @mouseover="onIms" @mouseout="offIms" @click.left="next">
        <div
          v-for="(im, idx) in images"
          v-show="idx > displayIdx - 1"
          :key="idx"
          ref="im"
          :class="['im', `im-${idx}`, { portrait: im.ar < contentArs[idx] }]"
          :style="{
            zIndex: images.length - idx,
          }"
        >
          <div class="im-in">
            <img
              :class="im.show ? 'show' : 'load'"
              :src="im.src"
              alt=""
              :width="im.obj.dimensions.width"
              :height="im.obj.dimensions.height"
              @load="getAr($event, idx)"
            />
          </div>
        </div>
      </div>

      <div class="blurb" @mouseover="showPag = false">
        <div @click.stop>
          <h2 v-if="!mobile && section" v-html="section" />
          <h3 v-if="!mobile" v-html="headline" />
          <prismic-rich-text v-if="copy && copy.constructor === Array" :field="copy" />
          <div v-else v-html="copy" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gallery from '../mixins/gallery.js'

export default {
  mixins: [gallery],

  watch: {
    content: {
      handler(content) {
        if (content) {
          this.displayIdx = 0

          this.images = content.images.map((im, idx) => {
            return {
              src: im,
              ar: content.objs[idx].dimensions.width / content.objs[idx].dimensions.height,
              show: false,
              obj: content.objs[idx],
            }
          })

          this.zoomImages = content.zoomImages ? content.zoomImages : content.images

          this.contentArs = content.images.map(() => {
            return 1.5
          })

          this.section = content.section
          this.headline = content.headline
          this.copy = content.copy

          if (this.shop) {
            this.product = content.product
            this.variants = this.product.variants.filter((x) => {
              return x.available
            })
            this.selectedVariant = this.variants.length
              ? this.variants[0].id
              : this.product.variants[0].id
          }
        }
      },
    },
  },
}
</script>

<style lang="stylus">

@import "../../assets/stylus/gallery"

.base-overlay {
  &.open {
    pointer-events auto

    .bg {
      opacity 1
    }
  }

  &.closed {
    pointer-events none

    .bg,
    .close,
    .content {
      opacity 0
    }
  }

  .bg, .close, .content {
    transition opacity $beat $easeOutSoft
  }

  .ims {
    +above($tablet) {
      bottom 0
      position absolute
      top 0
      left 20%
      right 20%
      pad(0, .5)
    }

    +below($tablet) {
      height 0
      padding-top 100%
      position relative
    }
  }

  img {
    transition opacity $beat * 0.5 $easeInOutSoft

    &.show {
      opacity 1
    }

    &.load {
      opacity 0
    }
  }

  &.expanded {
    .im {
      img {
        opacity .4
        transition-timing-function $easeOutCubic
        transition-duration $beat * 2
      }

      &-1 {
        img {
          transition-delay $beat * 0.5
        }
      }

      &-2 {
        img {
          transition-delay $beat
        }
      }
    }
  }

  .im {
    display flex
    position absolute

    &-in {
      background $w
      margin auto
      position relative
    }

    &.portrait {
      .im-in {
        height 100%
      }

      img {
        height 100%
        max-width none
        width auto
      }

      .im-1,
      .im-2 {
        justify-content flex-end
      }
    }

    &-0,
    &-3,
    &-6 {
      bottom 5px
      top 5px
      left (7100% / 375)
      right (7100% / 375)
      z-index 2

      +above($tablet) {
        bottom 47px
        top 41px
        left (100% / 6)
        right (100% / 6)
      }
    }

    &-1,
    &-4,
    &-7 {
      bottom 62px
      top 32px
      left (100% / 12)
      right (250% / 6)
      z-index 1

      +above($tablet) {
        bottom 80px
        top 114px
      }
    }

    &-2,
    &-5,
    &-8 {
      bottom 30px
      top 49px
      left (250% / 6)
      right (100% / 12)
      z-index 0

      +above($tablet) {
        bottom 73px
        top 156px
      }
    }
  }
}
</style>
