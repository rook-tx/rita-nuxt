<template>
  <div class="search-item">
    <button
      type="button"
      :aria-label="`Open ${result.name} image gallery`"
      :title="`Open ${result.name} image gallery`"
      @click.left="openGallery"
    >
      <div class="result-image">
        <transition appear>
          <img
            v-if="inview"
            v-show="ready"
            :src="uncompress(result.image.url)"
            :alt="`Model wears ${result.name} dress`"
            :width="resultWidth"
            :height="resultHeight"
            @load="setReady"
          >
        </transition>
      </div>
    </button>
    <span class="result-name">{{ result.name }}</span>
    <span class="result-season">{{ result.parent }}</span>
  </div>
</template>

<script>

import { mapState } from 'pinia';
import { useDeviceStore } from '../../stores/device';

export default {

  props: {
    result: {
      type: Object,
      default: () => ({
        id: null,
        name: null,
        parent: null
      })
    },

    scroll: {
      type: Number,
      default: 0
    },

    resultWidth: {
      type: Number,
      // default: window.innerWidth / 5
      default: 288
    },

    resultHeight: {
      type: Number,
      // default: window.innerWidth / 5 * 6 / 4
      default: 288
    }
  },

  data() {
    return {
      inview: false,
      ready: false,
      top: 0
    };
  },

  computed: {
    ...mapState(useDeviceStore, [
      'win',
      'mobile'
    ]),

    dimQuery() {
      return `&w=${this.resultWidth}&ar=4:6&fit=crop`;
    }
  },

  watch: {
    resultWidth: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.top = this.$el.offsetTop - this.win.y;
          this.inview = this.top < 0;
        });
      }
    },

    dimQuery: {
      handler() {
        this.ready = false;
      }
    },

    scroll: {
      handler(top) {
        if (!this.inview) {
          this.inview = top > this.top;
        }
      }
    }
  },

  methods: {
    setReady() {
      this.ready = true;
    },

    uncompress(src) {
      const compsrc = src.replace('auto=compress,format', 'auto=compress,format&cs=srgb');
      const qidx = compsrc.indexOf('&w=');
      if (this.dimQuery && qidx > 0) {
        return compsrc.substring(0, qidx) + this.dimQuery + (this.mobile ? '&dpr=2' : '');
      }
      return compsrc;
    },

    openGallery(e) {
      this.$emit('openGallery', e);
    }


  }

};

</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.search-item {
  .result-image {
    background $bg
    padding-bottom 150%
    position relative
    overflow hidden

    img {
      position absolute
      transition opacity $beat $easeOutSoft

      opacity 1

      &.v-enter-from,
      &.v-leave-to {
        opacity 0
      }
    }
  }

  .result-name {
    display block
    label()
    fs(10, 12)
    mgnP(5, 0, 2)

    +above($tablet) {
      fs(14, 14)
      mgnP(19, 0, 5)
    }

    +below($mobile) {
      fs(10, 12)
    }
  }

  .result-season {
    display block
    body2()

    +below($mobile) {
      fs(10, 12)
    }
  }
}

.dark-ui {
  .result-image {
    background lighten($black, 1%)
  }
}

</style>
