<template>
  <div class="search-bar">
    <div class="search-header">
      <input
        v-model="searchTerm"
        :class="[ 'search-input', { 'search-active': searchTerm }]"
        type="search"
        placeholder="Search by dress name, collection, etc."
        @input="checkClear"
        @change="getResults"
      >

      <button
        class="active-close"
        @click.left="activeClose"
      >
        <close />
      </button>
    </div>

    <div
      class="results-bg"
      @click="closeSearch"
    />

    <div
      v-show="lastSearch"
      ref="drawer"
      class="results-drawer"
      @scroll="onscroll"
    >
      <div class="results-count">
        <span>{{ results.length }} search results found for “{{ lastSearch }}”</span>
      </div>

      <div class="results-wrap">
        <ol class="search-results">
          <li
            v-for="(result, idx) in results"
            :key="result.id + idx"
            class="search-result"
          >
            <search-item
              :scroll="scroll"
              :result="result"
              :result-width="resultWidth"
              :result-height="resultHeight"
              @openGallery="openGallery(result.id, $event)"
            />
          </li>
        </ol>
      </div>
    </div>

    <zoom-overlay
      ref="overlay"
      :content="galleries[galleryIdx]"
      @closeGallery="closeGallery"
      @prevSet="prevSet"
      @nextSet="nextSet"
    />
  </div>
</template>

<script>

import search from '../mixins/search';
import Close from '../svg/Close.vue';

export default {

  components: { Close },

  mixins: [
    search
  ]

};

</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.search-bar {
  pointer-events auto

  &.v-enter,
  &.v-leave-to {
    .search-header {
      max-height 0px
    }

    .results-bg {
      opacity 0
    }
  }

  +below($tablet) {
    position fixed
    top 80px
    left 0
    bottom 0
    right 0
    z-index 13
  }

  .search-header {
    background $w
    position relative
    z-index 21
    overflow hidden
    border 1px solid #e5e5e5
    border-width 1px 0

    max-height 60px
    transition max-height $beat $easeOutCubic

    +above($tablet) {
      margin-top -1px
    }
  }

  .search-input {
    body2()
    display block
    pad(1, 1)
    width 100%

    &::-webkit-search-cancel-button {
      appearance none
      background url('/static/close.svg') no-repeat
      background-size contain
      height 18px
      width 18px
    }

    &::placeholder {
      color #7b7979
    }

    +above($laptop) {
      padP(16, 35, 16, 40)
      line-height (26 / 14)

      &::-webkit-search-cancel-button {
        height 26px
        width 26px
      }
    }
  }

  .search-active {
    &:focus {
      + .active-close {
        display none
      }
    }
  }

  .active-close {
    position absolute
    top 6px
    bottom 6px
    right 8px
    padP(12, 12)

    svg {
      stroke $black
    }

    +above($tablet) {
      right 34px
      top 12px
      bottom 12px
      padP(4, 4)

      svg{
        height 26px
        width 26px
      }
    }
  }

  .results-bg {
    background $w
    abs()
    transition opacity $beat $easeOutCubic
    opacity 1

    +above($tablet) {
      background $black
      opacity .3
      position fixed
    }
  }

  .results-drawer {
    background $w
    top 58px
    left 0
    right 0
    bottom 0
    position fixed
    overflow-y scroll
    overflow-x hidden
    -webkit-overflow-scrolling touch
    pointer-events auto
    z-index 20

    +below($tablet) {
      position absolute
    }
  }

  .results-count {
    display block
    body2()
    mgnP(14, 20, 30)

    +above($laptop) {
      mgnP(14, 40, 30)
    }
  }

  .results-wrap {
    mgnP(30, 17)

    +above($laptop) {
      mgnP(30, 30, 40)
    }
  }

  .search-results {
    display flex
    flex-wrap wrap
  }

  .search-result {
    text-align left
    padP(0, 3, 30)
    width (100% / 3)

    +above($tablet) {
      width (100% / 4)
    }

    +above($laptop) {
      padP(0, 10, 40)
      width (100% / 5)
    }

    button {
      width 100%
    }
  }
}

.dark-ui {
  .search-header {
    border-color lighten($black, 10%)
  }

  .search-input,
  .results-drawer {
    background $black
  }
}

</style>
