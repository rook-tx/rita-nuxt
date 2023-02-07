<template>
  <div class="landing-hero headline-center">
    <div class="image">
      <modules-plax-image
        :inview="true"
        :img-obj="slice.primary.image"
      />
    </div>

    <div class="headline">
      <svg-lockup />
    </div>
  </div>
</template>

<script>

import { getSliceComponentProps } from '@prismicio/vue';
import { mapState } from 'pinia';
import { useDeviceStore } from '~~/stores/device';

export default {
  
  props: {
    ...getSliceComponentProps([ 'slice', 'index' ]),

    header: {
      type: Object,
      default: null
    },

    data: {
      type: Object,
      default: null
    },

    items: {
      type: Array,
      default: null
    },

    scroll: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      src: null,
      obj: {},
      delta: 0.2,
      lastScroll: Number(0),
      // elHeight: window.innerHeight,
      // travel: window.innerHeight,
      elHeight: 800,
      travel: 800,
      deltaY: 0.2,
      // minusY: -window.innerHeight * 0.2,
      minusY: -100,
      inview: true
    };
  },

  computed: {
    ...mapState(useDeviceStore, [
      'win',
      'mobile'
    ]),

    plax() {
      return this.lastScroll / this.travel;
    },

    invertFactor() {
      return Math.min(1, this.plax);
    },

    factor() {
      return 1 - (1 - this.delta) * this.invertFactor;
    },

    yFactor() {
      return this.minusY + this.deltaY * this.invertFactor;
    }
  },

  watch: {
    win: {
      handler() {
        this.$nextTick(this.updateDims);
      }
    },

    data: {
      immediate: true,
      handler(data) {
        if (data) {
          this.src = data.image && data.image.url && this.mobile ?
            data.image.Mobile.url :
            data.image && data.image.url && !this.mobile ?
              data.image.url : this.src;
          this.obj = this.mobile ?
            data.image.Mobile : data.image;
        }
      }
    },

    invertFactor: {
      handler(factor, oldFactor) {
        if (factor === 1) {
          this.$root.$emit('showLogo');
        } else if (oldFactor === 1 && factor < 1) {
          this.$root.$emit('hideLogo');
        }
      }
    },

    scroll: {
      immediate: true,
      handler(e) {
        this.onscroll(e);
      }
    }
  },

  mounted() {
    // this.$root.$on('logoDim', this.updateLogoDims);
    // this.$root.$emit('hideLogo');

    setTimeout(this.updateDims, 600);
    setTimeout(this.updateDims, 1200);
  },

  beforeDestroy() {
    // this.$root.$off('logoDim', this.updateLogoDims);
    // this.$root.$emit('showLogo');
  },

  methods: {
    updateLogoDims(e) {
      this.logoY = e.y;
      this.logoX = e.x;
      this.updateDims();
    },

    updateDims() {
      this.elHeight = this.$el.clientHeight;
      this.travel = this.elHeight;
      this.delta = this.logoX / this.$refs.lockup.$el.clientWidth;
      this.minusY = this.$refs.lockup.$el.clientHeight / -2;
      this.deltaY = this.logoY + this.elHeight / 2;
    },

    onscroll(e) {
      this.inview = e < this.elHeight * 1.1;

      if (this.inview) {
        this.lastScroll = e;
      } else {
        this.lastScroll = this.travel;
      }
    }

    // render() {
    //   if (!this.rendering) { return; }

    //   const diff = this.lastScroll - this.rscroll;

    //   if (Math.abs(diff) > 1 / 12) {
    //     this.rscroll += diff / 4;
    //   }

    //   requestAnimationFrame(this.render);
    // }
  }

};

</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.landing-hero {
  position relative

  .headline  {
    mgn(.5, 1)
    position relative
    z-index 1

    +above($tablet) {
      mgn(0, 2)
    }

    h1, .scale-headline {
      display1()
    }

    h1 {
      display inline-block
      vertical-align bottom
      opacity 0
      margin 0
    }
  }

  .scale-wordmark {
    left 0
    position absolute
    top 0
    transform-origin center
    right 0

    svg {
      fill $black
      width 100%
    }

    &.hide {
      opacity 0
    }
  }

  .scale-headline {
    left 0
    position absolute
    top 0
    transform-origin left center
  }

  .plax-spacer {
    padding-bottom 61.4826%
  }

  .image {
    background-size cover
    position relative
    max-height 85vh
    overflow hidden
    z-index 0

    +above($tablet) {
      max-height 99vh
    }

    // img {
    //   opacity 0
    //   width 100%
    // }
  }

  &.headline-center {
    .headline {
      top 50%
      left $let * 1rem
      right $let * 1rem
      margin 0
      position absolute
      text-align center

      +above($tablet) {
        left $let * 2rem
        right $let * 2rem
      }
    }
  }
}

</style>
