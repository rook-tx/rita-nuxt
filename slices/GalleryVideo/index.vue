<template>
  <div
    :class="[
      'gallery-video',
      open ? 'video-open' : 'video-closed',
      {
        'video-opening': opening,
      },
    ]"
  >
    <div class="wrap">
      <div class="six-ten-col" :style="zoomPoster">
        <button type="button" title="Open video" @click.left="openGallery($event)">
          <img v-if="posterSrc" v-show="posterSrc" :src="posterSrc" alt="" />
          <span class="video-cta">Play video</span>
        </button>
      </div>
    </div>

    <div
      :class="[
        'gallery-overlay',
        'video-overlay',
        open ? 'open' : 'closed',
        'nocursor',
        moing ? 'show-ui' : 'hide-ui',
        {
          opening: opening,
        },
      ]"
    >
      <div class="bg" />

      <div
        v-if="open && !mobile"
        class="closecursor"
        :style="{
          transform: `translateX(${newPos.x}px) translateY(${newPos.y}px)`,
        }"
      >
        <close />
      </div>

      <div v-if="mobile" class="close">
        <button type="button" title="Close gallery" @click.left="closeGallery">
          <close />
        </button>
      </div>

      <div class="content" @click.left="closeGallery">
        <div v-if="landscape && youtube" class="ims">
          <div ref="vidwrap" class="youtube-wrap">
            <div
              id="youtube"
              ref="youtube"
              :src="`https://www.youtube.com/embed/${youtube}?enablejsapi=1&origin=http://localhost`"
              width="100%"
              height="100%"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              enablejsapi
            />
          </div>
        </div>

        <div v-else-if="landscape" class="ims">
          <div ref="vidwrap" class="video-wrap" @click.stop>
            <video
              v-if="videoSrc"
              ref="vid"
              :src="videoSrc"
              :poster="posterSrc"
              playsinline
              preload="none"
            />
            <button
              type="button"
              :title="`${playing ? 'Pause' : 'Play'} video`"
              @mouseover="showCursor = true"
              @mouseout="showCursor = false"
              @click.left="clickVid"
            />
            <div class="video-ctrls">
              <div
                class="trackbar-wrap"
                @mouseover="trackmo"
                @mousemove="getTrackProg"
                @click="goSeek"
              >
                <div class="fadebar" />
                <div
                  class="trackbar"
                  :style="{
                    transform: `scaleX(${progress})`,
                  }"
                />
                <div
                  class="mobar"
                  :style="{
                    transform: `translateX(${trackprog * 100}%)`,
                  }"
                >
                  <div class="curr-time" v-html="seekClock" />
                </div>
              </div>

              <div class="vol-switch">
                <button
                  type="button"
                  :title="`${muted ? 'Raise' : 'Mute'} video volume`"
                  @click.left="clickVol"
                >
                  <mute-vol v-if="muted" />
                  <full-vol v-else />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="mobile-warning">
          Please rotate your device horizontally to play video
        </div>
      </div>

      <div
        v-if="showCursor"
        class="pagcursor"
        :style="{
          transform: `translateX(${newPos.x}px) translateY(${newPos.y}px)`,
        }"
      >
        <span v-html="playing ? 'Pause' : 'Play'" />
      </div>
    </div>
  </div>
</template>

<script>
import { getSliceComponentProps } from '@prismicio/vue'
import Close from '@/components/svg/Close.vue'
import MuteVol from '@/components/svg/MuteVol.vue'
import FullVol from '@/components/svg/FullVol.vue'
import { mapActions, mapState } from 'pinia'
// import cmsProps from '../mixins/cms-props.js';
// import parallax from '../mixins/parallax.js';
import { useDeviceStore } from '@/stores/device'
import { useUiStore } from '@/stores/ui'

export default {
  components: {
    Close,
    MuteVol,
    FullVol,
  },

  props: {
    ...getSliceComponentProps(['slice']),
  },

  // mixins: [
  //   cmsProps,
  //   parallax
  // ],

  data() {
    return {
      open: false,
      opening: false,

      progress: 0,
      trackprog: 0,
      duration: 10,
      playing: false,
      muted: false,
      showCursor: false,

      player: null,

      moing: true,
      newPos: {
        x: 0.5, // window.innerWidth * 0.5,
        y: 0.5, // window.innerHeight * 0.5,
      },

      yDelta: 0,
      scale: 1,
    }
  },

  computed: {
    ...mapState(useDeviceStore, ['device', 'mobile', 'win']),

    posterSrc() {
      return this.slice?.primary.video_poster
        ? `${this.slice.primary.video_poster.url
            .replace('auto=compress,format', 'auto=compress,format&q=75&cs=srgb')
            .replace('auto=format,compress', 'auto=compress,format&q=75&cs=srgb')}&w=900`
        : ''
    },

    youtube() {
      return this.slice?.primary.youtube ? this.slice.primary.youtube : ''
    },

    videoSrc() {
      return this.slice?.primary.video_src ? this.slice.primary.video_src.url : ''
    },

    landscape() {
      return !this.mobile || !this.device.portrait
    },

    seekClock() {
      const abs = Math.floor(this.trackprog * this.duration)
      const mins = Math.floor(abs / 60)
      let clock = abs % 60
      if (clock < 10) {
        clock = `0${clock}`
      }
      return `0${mins}:${clock}`
    },

    zoomPoster() {
      return {
        transform: `translateY(${this.yDelta}px) scale(${this.scale})`,
      }
    },
  },

  watch: {
    open: {
      handler(open) {
        if (open) {
          window.addEventListener('mousemove', this.momo, { passive: true })
        } else {
          this.showBack = false
          this.showPag = false
          window.removeEventListener('mousemove', this.momo, { passive: true })
        }
      },
    },
  },

  beforeDestroy() {
    this.player = null
    this.closeGallery()
    window.removeEventListener('mousemove', this.momo, { passive: true })
  },

  methods: {
    ...mapActions(useUiStore, ['toggleGallery']),

    openGallery(e) {
      this.opening = true

      if (e && !this.mobile) {
        this.newPos = { x: e.clientX, y: e.clientY }

        this.yDelta = this.lastScroll - this.elEnd + this.winHeight / 2 - this.elHeight / 2
        this.scale = this.$refs.vidwrap.clientWidth / e.target.clientWidth
      }

      this.open = true

      setTimeout(() => {
        this.opening = false
        this.toggleGallery(true)
        this.startVid()
      }, 650 * 1.5)
    },

    closeGallery() {
      this.stopVid()
      if (this.$refs.vid) {
        this.$refs.vid.currentTime = 0
      }
      this.yDelta = 0
      this.scale = 1
      this.toggleGallery(false)
      this.open = false
    },

    clickVid() {
      if (this.playing) {
        this.stopVid()
      } else {
        this.startVid()
      }
    },

    startVid() {
      if (this.$refs.vid) {
        this.$refs.vid.play()
        this.duration = this.$refs.vid.duration
        this.tick = true
        this.tickTrack()
      }

      if (this.player && this.player.playVideo) {
        this.player.playVideo()
      } else if (this.$refs.youtube) {
        this.onYouTubeIframeAPIReady()
      }
    },

    stopVid() {
      this.playing = false
      this.tick = false
      if (this.$refs.vid) {
        this.$refs.vid.pause()
      }
      if (this.player && this.player.stopVideo) {
        this.stopVideo()
      }
    },

    stopVideo() {
      this.player.stopVideo()
    },

    onPlayerReady(event) {
      console.log('YT Player Ready')
      event.target.playVideo()
    },

    onPlayerStateChange(event) {
      const playerStatus = event.data
      // console.log('YT Player State Change:', playerStatus);
      if (playerStatus === -1) {
        // unstarted
      } else if (playerStatus === 0) {
        // ended
      } else if (playerStatus === 1) {
        // playing
      } else if (playerStatus === 2) {
        // paused
      } else if (playerStatus === 3) {
        // buffering
      } else if (playerStatus === 5) {
        // video cued
      }
    },

    onYouTubeIframeAPIReady() {
      // eslint-disable-next-line no-undef
      this.player = new YT.Player('youtube', {
        videoId: this.youtube,
        playerVars: {
          playsinline: 1,
        },
        events: {
          onReady: this.onPlayerReady,
          onStateChange: this.onPlayerStateChange,
        },
      })
    },

    tickTrack() {
      this.progress = this.$refs.vid.currentTime / this.duration
      this.playing = !this.$refs.vid.paused
      this.muted = this.$refs.vid.muted

      if (this.tick) {
        requestAnimationFrame(this.tickTrack)
      }
    },

    clickVol() {
      if (this.muted) {
        this.fullVol()
      } else {
        this.muteVol()
      }
    },

    muteVol() {
      this.muted = true
      this.$refs.vid.muted = true
    },

    fullVol() {
      this.muted = false
      this.$refs.vid.muted = false
    },

    trackmo(e) {
      this.trackLeft = e.target.offsetParent.offsetParent.offsetLeft + e.target.offsetLeft
      this.trackMax = e.target.offsetWidth

      this.getTrackProg(e)
    },

    getTrackProg(e) {
      this.trackprog = (e.clientX - this.trackLeft) / this.trackMax
    },

    goSeek() {
      this.$refs.vid.currentTime = this.duration * this.trackprog
    },

    momo(e) {
      clearTimeout(this.moTimeout)
      this.moing = true

      this.newPos = {
        x: e.clientX,
        y: e.clientY,
      }

      this.moTimeout = setTimeout(() => {
        this.moing = false
      }, 650 * 2)
    },
  },
}
</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.gallery-video {

  &.video-open {
    +above($tablet) {
      .six-ten-col {
        transform scale(80 / 60)
      }
    }
  }

  .six-ten-col {
    pad(0, .5)

    +above($tablet) {
      col(6, 10)
      mgn(5, auto)
      transform scale(1)
      transition transform $beat * 1.5 $easeOutSoft

      button {
        cursor pointer

        &:hover {
          .video-cta {
            &::after {
              transform scaleX(0)
            }
          }
        }

        img {
          pointer-events none
        }
      }
    }

    img {
      width 100%
    }

    button {
      position relative
      width 100%
    }
  }

  .video-cta {
    left 50%
    top 50%
    transform translateX(-50%) translateY(-50%)
    pointer-events none
    label()
    underline()
    position absolute

    &::after {
      bottom 0
    }
  }
}

.video-overlay.video-overlay {
  &.open {
    pointer-events auto

    .bg,
    .close,
    .closecursor,
    .pagcursor,
    .mobile-warning,
    .ims {
      opacity 1
    }

    .six-ten-col {
      opacity 0
      z-index 22
    }
  }

  &.closed {
    pointer-events none

    .bg,
    .closecursor,
    .pagcursor,
    .close,
    .mobile-warning,
    .ims {
      opacity 0
      transition-delay 0ms
    }
  }

  &.opening {
    .pagcursor,
    .closecursor {
      opacity 0
    }

    .ims {
      transition-delay $beat * .5
    }
  }

  &.hide-ui {
    .video-ctrls,
    .pagcursor {
      opacity 0
    }
  }

  &.show-ui {
    .video-ctrls,
    .pagcursor {
      opacity 1
    }
  }

  .bg,
  .close,
  .mobile-warning,
  .ims {
    transition opacity $beat $easeOutSoft
  }

  .bg {
    opacity 0
    transition-duration $beat * 1.5
  }

  .content {
    +below($tablet) {
      overflow hidden
    }
  }

  .ims {
    display flex
    left 10%
    top 1%
    padding 0
    position absolute
    height auto
    bottom 1%
    right 10%
  }

  .youtube-wrap {
    background $w
    position relative
    margin auto
    width 100%
    aspect-ratio 16 / 9
    padding-bottom (900% / 16)

    iframe {
      abs()
      width 100%
      height 100%
    }
  }

  .video-wrap {
    background $w
    position relative
    margin auto
    max-height 100%
    max-width 100%
    display flex

    video {
      max-height 100%
      max-width 100%
    }

    button {
      abs()
    }
  }

  .mobile-warning {
    left 50%
    top 50%
    position absolute
    transform translateX(-50%) translateY(-50%)
    label()
    text-align center
  }

  .closecursor,
  .pagcursor {
    opacity 1
    position absolute
    pointer-events none
    transition opacity $beat $easeOutQuint
    z-index 1

    &.v-enter,
    &.v-leave-to {
      opacity 0
    }
  }

  .closecursor {
    height 1px
    left -9px
    top -9px
    width 1px

    svg {
      height 18px
      stroke $black
      max-width 18px
      width 18px
    }

    +above($tablet) {
      left -13px
      top -13px

      svg {
        height 26px
        max-width 26px
        width 26px
      }
    }
  }

  .pagcursor {
    label()
    left -5em
    top 0
    text-align center
    width 10em
  }

  .video-ctrls {
    opacity 1
    transition opacity $beat $easeOutQuint
  }

  .trackbar-wrap {
    height 45px
    position absolute
    padding 21px 0
    bottom 15px
    left 30px
    right 78px
    transform translateZ(0)
    overflow hidden

    &:hover {
      .mobar {
        opacity 1
      }
    }
  }

  .trackbar,
  .fadebar,
  .mobar {
    background $black
    height 3px
    left 0
    position absolute
    pointer-events none
    width 100%
  }

  .fadebar {
    opacity .12
  }

  .trackbar {
    opacity .2
    transform-origin left
  }

  .mobar {
    left auto
    right 100%
    transform-origin left
    opacity 0
    transition opacity $beat $easeOutQuint
  }

  .curr-time {
    bottom 3px
    position absolute
    width 10em
    right -5em
    label()
    line-height 21px
    text-align center
  }

  .vol-switch {
    position absolute
    right 0
    bottom 15px

    button {
      cursor pointer
      position relative
      padding 12px 30px 12px 21px
    }

    svg {
      height 20px
      stroke $black
      max-width 27px
      width 27px
    }
  }
}
</style>
