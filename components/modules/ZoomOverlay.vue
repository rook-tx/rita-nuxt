<template>
  <div
    :class="[
      'gallery-overlay',
      'zoom-gallery',
      open ? 'open' : 'closed',
      showingZoom ? 'expanded' : 'collapsed',
      mobile ? 'cursor' : 'nocursor',
      {
        'gallery-opening': opening
      }
    ]"
  >
    <div class="bg" />

    <div class="close">
      <button
        type="button"
        aria-label="Close gallery"
        @mouseover="showBack = showPag = false"
        @click.left="closeGallery"
      >
        <close />
      </button>
    </div>

    <div
      class="content"
    >
      <div
        v-if="mobile"
        class="mobile-headline"
      >
        <router-link
          :to="link"
          @click.native.left="closeSearchAndGallery"
        >
          <h2
            v-if="section"
            v-html="section"
          />
        </router-link>
        <h3
          v-html="headline"
        />
      </div>

      <div
        class="back-zone"
        @mouseover="onBack"
        @mouseout="offBack"
      >
        <button
          type="button"
          @click.left.prevent="prev"
        >
          Back
        </button>
      </div>

      <transition appear>
        <div
          ref="frame"
          :key="frameKey"
          class="ims"
          @mouseover="onIms"
          @mouseout="offIms"
          @click.left="next"
        >
          <div
            v-for="(im, idx) in images"
            v-show="idx > displayIdx - 1"
            :key="idx"
            ref="im"
            :class="[
              'im',
              `im-${idx}`,
              {
                zish: zish,
                portrait: im.ar < contentArs[idx],
                'im-exp': expIdx === idx
              }
            ]"
            :style="imZoom[idx]"
          >
            <div
              ref="framein"
              class="im-in"
            >
              <img
                ref="ims"
                :class="im.show ? 'show' : 'load'"
                :src="im.src"
                alt=""
                @load="getAr($event, idx)"
              >

              <div
                class="expand"
              >
                <button
                  type="button"
                  aria-label="Expand image"
                  @mouseover.stop="showPag = false"
                  @click.left.stop="expandImage($event, idx)"
                >
                  <plus focusable="false" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div
        class="blurb"
        @mouseover="showPag = false"
      >
        <div @click.stop>
          <div
            v-if="mobile"
            class="mobile-pag"
            v-html="`${displayIdx + 1} of ${images.length}`"
          />
          <router-link
            v-if="!mobile && link && section"
            :to="link"
            class="section-link"
            @click.native.left="closeSearchAndGallery"
          >
            <h2
              v-html="section"
            />
          </router-link>

          <h2
            v-else-if="!mobile && section"
            v-html="section"
          />

          <h3
            v-if="!mobile"
            v-html="headline"
          />

          <prismic-rich-text
            v-if="copy && copy.constructor === Array"
            :field="copy"
          />

          <div
            v-else
            v-html="copy"
          />

          <p v-if="$route.params.slug !== 'bespoke'">
            <button
              v-if="shop"
              class="cta"
              type="button"
              @click.left="addToCart"
              v-html="added"
            />

            <router-link
              v-else
              to="/find-store"
              class="cta"
              event=""
              @click.left.native="openMap"
            >
              Find in store
            </router-link>
          </p>

          <p v-if="$route.params.slug !== 'bespoke'">
            Questions?
            <a
              href="mailto:concierge@ritavinieris.com"
              target="_blank"
              rel="noopener"
            >Email us
            </a>
          </p>
        </div>
      </div>
    </div>

    <transition appear>
      <div
        v-if="!mobile && showBack && !expanded"
        class="pagcursor"
        :style="{
          transform: `translateX(${newPos.x}px) translateY(${newPos.y}px)`
        }"
        v-html="`Back`"
      />
    </transition>

    <transition appear>
      <div
        v-if="!mobile && showPag && !expanded"
        class="pagcursor"
        :style="{
          transform: `translateX(${newPos.x}px) translateY(${newPos.y}px)`
        }"
        v-html="`${displayIdx + 1} of ${images.length}`"
      />
    </transition>

    <div class="zoom-overlay">
      <transition
        appear
        duration="1300"
      >
        <div
          v-if="expanded"
          ref="zoom"
          class="zoom-image"
          :style="pos"
          @click.left="collapseImage"
        >
          <div
            class="zoom-spacer"
            :style="zoomDims"
          />
          <img
            :src="images[expIdx].src"
            alt=""
          >
          <img
            :class="showZoom ? 'show' : 'load'"
            :src="expanded"
            alt=""
            @load="imDims"
          >
        </div>
      </transition>

      <div
        v-if="expanded"
        class="showcursor"
        :style="{
          transform: `translateX(${newPos.x}px) translateY(${newPos.y}px)`
        }"
      >
        <close :style="{transform: `rotateZ(${cursorPos.z}deg)` }" />
      </div>
    </div>
  </div>
</template>

<script>

import gallery from '../mixins/gallery';
import product from '../mixins/product';

import { mapActions, mapState } from 'pinia';
import { useDeviceStore } from '../../stores/device';
import { useSearchStore } from '../../stores/search';

export default {

  mixins: [
    gallery,
    product
  ],

  data() {
    return {

      images: [
        { ar: 0.8 }
      ],
      contentArs: [
        540 / 812
      ],

      opening: false,
      zish: false,

      expanded: null,
      expIdx: -1,

      deltaX: 0,
      deltaY: 0,
      offX: -50,
      offY: -50,

      newPos: {
        // x: window.innerWidth * 0.5,
        // y: window.innerHeight * 0.5
        x: 720,
        y: 400
      },
      
      cursorPos: {
        // x: window.innerWidth * 0.4,
        // y: window.innerHeight * 0.4,
        x: 720,
        y: 400,
        z: -45
      },

      imZoom: [],

      frameKey: -1

    };
  },

  computed: {
    ...mapState(useDeviceStore, [
      'winWidth',
      'winHeight'
    ]),

    pos() {
      return `transform:translateX(${this.offX}%) translateY(${this.offY}%) translateZ(0)`;
    },

    zoomWidth() {
      return Math.round(this.mobile ? this.winHeight * this.images[this.displayIdx].ar : this.winWidth * 1.1);
    },

    zoomHeight() {
      return Math.round(this.mobile ? this.winHeight : this.winWidth * 1.1 / this.images[this.displayIdx].ar);
    },

    zoomDims() {
      return {
        height: `${this.zoomHeight}px`,
        width: `${this.zoomWidth}px`
      };
    },

    xRatio() {
      return (this.zoomWidth - this.winWidth) / this.zoomWidth * 100;
    },

    yRatio() {
      return (this.zoomHeight - this.winHeight) / this.zoomHeight * 100;
    }
  },

  watch: {
    content: {
      immediate: true,
      handler(content, oldContent) {
        if (content) {
          console.log('go'); // eslint-disable-line

          this.displayIdx = 0;

          const ims = content.images;

          this.images = ims.map((im, idx) => {
            return {
              src: im,
              ar: content.objs ?
                content.objs[idx].dimensions.width / content.objs[idx].dimensions.height : 0,
              show: false,
              obj: content.objs ? content.objs[idx] : null
            };
          });

          const imZooms = [];

          ims.forEach((im, idx) => {
            imZooms.push(this.getImZoom(idx, ims.length));
          });

          this.imZoom = imZooms;

          this.contentArs = content.images.map(() => {
            return 540 / 812;
          });

          this.section = content.section;
          this.headline = content.headline;
          this.copy = content.copy;

          if (this.shop) {
            this.product = content.product;
            this.variants = this.product.variants.filter((x) => {
              return x.available;
            });
            this.selectedVariant = this.variants.length ? this.variants[0].id : this.product.variants[0].id;
          }

          this.frameKey = content.gidx;
          this.link = content.link ? content.link : this.link;

        }

        if (!oldContent && this.$refs.ims && this.$refs.ims.length) {
          console.log('re'); // eslint-disable-line
          this.$refs.ims.forEach((im, idx) => {
            this.getAr({
              target: {
                clientWidth: im.clientWidth,
                clientHeight: im.clientHeight
              }
            }, idx);
          });
        }
      }
    },

    win: {
      handler() {
        this.getContentAr();
      }
    },

    open: {
      handler(open) {
        if (open) {
          window.addEventListener('mousemove', this.momo, { passive: true });
        } else {
          this.showBack = false;
          this.showPag = false;
          window.removeEventListener('mousemove', this.momo, { passive: true });
        }
      }
    }
  },

  beforeDestroy() {
    window.removeEventListener('mousemove', this.momo, { passive: true });
  },

  methods: {
    getImZoom(idx, length) {

      const im0 = {
        height: `${812 / 900 * 100}%`,
        transform: `translateX(${122 / 540 * 100}%) translateY(${47 / 812 * 100}%) translateZ(0) scale(1)`, // eslint-disable-line
        width: `${540 / 784 * 100}%`
      };

      const im1 = {
        height: `${706 / 900 * 100}%`,
        transform: `translateX(${67 / 422 * 100}%) translateY(${80 / 706 * 100}%) translateZ(0) scale(1)`, // eslint-disable-line
        width: `${422 / 784 * 100}%`
      };

      const im2 = {
        height: `${671 / 900 * 100}%`,
        transform: `translateX(${311 / 402 * 100}%) translateY(${157 / 671 * 100}%) translateZ(0) scale(1)`, // eslint-disable-line
        width: `${402 / 784 * 100}%`
      };

      let xform = idx % 3 === 1 ? im1 :
        idx % 3 === 2 ? im2 :
          im0;

      if (this.content.gidx && this.content.gidx % 2) {
        xform = idx % 3 === 1 ? im2 :
          idx % 3 === 2 ? im1 :
            im0;
      }

      return {
        ...xform,
        zIndex: length - idx
      };
    },

    ...mapActions(useSearchStore, [
      'closeSearch'
    ]),

    setScale(e, top) {

      this.top = top;

      const frame = this.$refs.frame;
      const frameIn = this.$refs.framein[0];

      this.left = e.target.offsetLeft - frame.offsetLeft;

      this.scale = e.target.clientWidth / (frameIn ? frameIn.clientWidth : 540 / 784 * frame.clientWidth);

      this.$nextTick(this.openGallery);

    },

    openGallery() {
      this.opening = true;

      this.toggleGallery(true);

      this.zish = true;
      this.imZoom[0].transform =
        `translateX(${this.left}px) translateY(${this.top}px) translateZ(0) scale(${this.scale})`;

      this.open = true;

      setTimeout(() => {
        this.zish = false;
        this.imZoom[0].transform =
          `translateX(${122 / 540 * 100}%) translateY(${47 / 812 * 100}%) translateZ(0) scale(1)`; // eslint-disable-line
      }, 650 * 0.25);

      setTimeout(() => {
        this.opening = false;
      }, 650 * 1.5);
    },

    closeSearchAndGallery() {
      this.closeSearch();
      this.$nextTick(this.closeGallery);
    },

    closeGallery() {
      this.toggleGallery(false);
      this.$emit('closeGallery');
      this.open = false;
      this.zish = false;
      this.frameKey = -1;
    },

    openMap() {
      // this.$root.$emit('openMap');
      console.log('openMap');
    },

    expandImage(e, idx) {

      this.showingZoom = true;

      this.newPos.x = e.clientX;
      this.newPos.y = e.clientY;

      const im = this.images[idx];

      this.cursorPos.z = -45;
      this.expanded = this.uncompressZoom(im.src);

      const frame = this.$refs.frame;
      const frameIn = this.$refs.framein[idx];

      // const frameWidth = frame.clientWidth;
      const frameInWidth = frameIn.clientWidth;

      const scale = this.mobile ?
        this.winHeight / frameIn.clientHeight :
        this.zoomWidth / frameInWidth;

      const offLeft = frame.offsetLeft + frameIn.offsetLeft * scale;
      const offTop = frame.offsetTop + frameIn.offsetTop * scale;

      const left = this.mobile ?
        this.winWidth / 2 - offLeft - this.zoomWidth / 2 :
        -offLeft - e.clientX / this.winWidth * this.xRatio / 100 * this.zoomWidth;

      const top = this.mobile ?
        -offTop :
        -offTop - e.clientY / this.winHeight * this.yRatio / 100 * this.zoomHeight;

      this.expIdx = idx;
      this.prevZoom = this.imZoom[idx].transform;

      this.imZoom[idx].transform = `translateX(${left}px) translateY(${top}px) translateZ(0) scale(${scale})`;

      this.showMo = true;

    },

    collapseImage() {

      this.showMo = false;
      this.showZoom = false;
      this.cursorPos.z = -45;
      this.expanded = null;
      this.offX = -50;
      this.offY = -50;
      this.deltaX = 0;
      this.deltaY = 0;

      this.imZoom[this.expIdx].transform = this.prevZoom;

      this.showingZoom = false;

    },

    momo(e) {
      clearTimeout(this.tickTimeout);

      this.newPos = {
        x: e.clientX,
        y: e.clientY
      };

      if (!this.ticking) {
        this.ticking = true;
        this.updateCursor();

        this.tickTimeout = setTimeout(() => {
          this.ticking = false;
        }, 650 * 3);
      }
    },

    updateCursor() {

      this.cursorPos.x -= (this.cursorPos.x - (this.showMo ? this.newPos.x : this.winWidth / 2)) / 15;
      this.cursorPos.y -= (this.cursorPos.y - (this.showMo ? this.newPos.y : this.winHeight / 2)) / 15;

      if (!this.mobile) {
        this.deltaX = (this.cursorPos.x - this.winWidth / 2) / this.winWidth;
        this.deltaY = (this.cursorPos.y - this.winHeight / 2) / this.winHeight;

        this.offX = -50 - this.deltaX * this.xRatio;
        this.offY = -50 - this.deltaY * this.yRatio;
      }

      if (this.ticking) {
        requestAnimationFrame(() => {
          this.updateCursor();
        });
      }

    },

    imDims() {

      this.showZoom = true;
      this.cursorPos.z = 0;

    },

    uncompressZoom(src) {
      const compsrc = src.replace('auto=compress,format', 'auto=compress,format&cs=srgb&q=70');
      const qidx = compsrc.indexOf('&w=');
      if (qidx > 0) {
        return compsrc.substring(0, qidx) + `&w=${Math.min(1920, this.zoomWidth)}`;
      }
      return compsrc;
    }
  }

};

</script>

<style lang="stylus">

@import "../../assets/stylus/gallery"

.zoom-gallery {
  &.open {
    pointer-events auto

    .bg,
    .close,
    .im,
    .blurb,
    .mobile-headline {
      opacity 1
    }
  }

  &.closed {
    pointer-events none

    .bg,
    .close,
    .im,
    .blurb,
    .mobile-headline {
      opacity 0
      transition-delay 0ms
    }
  }

  &.gallery-opening {
    .close,
    .im,
    .blurb,
    .pagcursor,
    .mobile-headline {
      opacity 0
    }

    .im-0 {
      opacity 1
      transition opacity $beat $easeOutSoft,
        transform $beat * 1.5 $easeInOutCubic
      transition-delay 0ms

      &.zish {
        transition-duration $beat, 0ms
      }
    }

    .blurb,
    .mobile-headline {
      transition-delay $beat * 1.5
    }

    .bg {
      transition-delay 0ms
    }
  }

  .bg,
  .close,
  .blurb,
  .mobile-headline {
    transition opacity $beat $easeOutSoft
  }

  .bg {
    opacity 0
    transition-duration $beat * 1.5
  }

  .im {
    transition-delay 0ms
  }

  .expand {
    bottom 0
    position absolute
    left 0
    opacity 1
    transition opacity $beat $easeOutCubic

    +above($tablet) {
      bottom 10px
      left 14px
    }

    button {
      display block
      background rgba($w, 0.01)
      padding 10px
      cursor pointer
    }

    svg {
      stroke $black
    }

    +below($tablet) {
      button {
        height 44px
        padding 11px
        width 44px
      }
    }
  }

  &.expanded {
    .expand {
      opacity 0
    }
  }

  .back-zone {
    &, button {
      cursor none
    }
  }

  .section-link {
    enterline()

    &::after {
      bottom 0
    }
  }

  .zoom-overlay {
    abs()
    cursor none
    z-index 5

    &, img {
      pointer-events none
    }
  }

  .zoom-image {
    pointer-events auto
    position absolute
    left 50%
    top 50%
    width 100%
    z-index 0

    +above($tablet) {
      width 110%
    }

    .zoom-spacer {
      position relative
    }

    img {
      abs()
      height auto
    }

    +below($tablet) {
      height 100%
      width auto
    }

    opacity 1
    transition opacity $beat $easeInOutSoft

    &.v-enter-active {
      transition-delay $beat * 1.5
    }

    &.v-enter-from,
    &.v-leave-active {
      opacity 0
    }
  }

  .pagcursor,
  .showcursor {
    opacity 1
    position absolute
    pointer-events none
    transition opacity $beat $easeOutQuint
    z-index 1

    &.v-enter-from,
    &.v-leave-to {
      opacity 0
    }
  }

  .pagcursor {
    label()
    left -5em
    top 0
    text-align center
    width 10em
  }

  .showcursor {
    height 1px
    left -9px
    top -9px
    width 1px

    svg {
      height 18px
      stroke $black
      max-width 18px
      transform rotateZ(0deg)
      transition transform $beat $easeOutQuint
      width 18px
    }
  }
}

</style>
