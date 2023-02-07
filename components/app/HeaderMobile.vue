<template>
  <header>
    <div
      :class="[
        'bar-icon',
        { margin: showStoreNoti }
      ]"
    >
      <button
        type="button"
        class="bar-btn"
        @click.left="toggleDrawer"
      >
        Menu
      </button>
    </div>

    <div class="header-bar">
      <transition>
        <div
          v-if="showStoreNoti"
          class="store-noti"
        >
          Our veils are now shoppable online!
        </div>
      </transition>

      <div :class="[ 'lockup-badge', show || drawerOpen ? 'show' : 'hide' ]">
        <div class="home">
          <router-link
            to="/"
            title="Home"
            @click.native.left="toggleCart(false)"
          >
            <lockup
              ref="lockup"
              focusable="false"
            />
          </router-link>
        </div>
      </div>
    </div>

    <div
      :class="[
        'bar-icon',
        'bar-cart-icon',
        { margin: showStoreNoti }
      ]"
    >
      <div :class="[ 'link', 'cart', $route.name === 'cart' || $route.name === 'veils' ? 'open' : 'closed' ]">
        <cart-icon
          icon-class="link-head"
        />
      </div>
    </div>

    <div
      :class="[
        'nav-drawer',
        drawerOpen ? 'drawer-open' : 'drawer-closed'
      ]"
    >
      <div class="drawer-icon">
        <button
          type="button"
          class="drawer-btn"
          @click.left="toggleDrawer"
        >
          <close />
        </button>
      </div>

      <nav>
        <ul class="header-wrap">
          <div class="links">
            <li
              v-for="(link, idx) in navLinks"
              :key="idx"
              :class="[
                'link',
                link.class ? link.class : null,
                { 'open': dropOpen === idx }
              ]"
            >
              <button
                v-if="link.class === 'just-drop'"
                class="link-head"
                type="button"
                @click.left="toggleDrop(idx)"
                v-html="link.name"
              />
              <router-link
                v-else
                :to="link.route"
                class="link-head"
                @click.native.left="closeDrawer"
                v-html="link.name"
              />
              <div
                v-if="link.sub"
                class="drop"
              >
                <ul>
                  <li
                    v-for="(sublink, sidx) in link.sub"
                    :key="sidx"
                  >
                    <router-link
                      :to="sublink.route"
                      @click.native.left="closeDrawer"
                      v-html="sublink.name"
                    />
                  </li>
                </ul>
              </div>
            </li>
          </div>

          <div class="links">
            <li class="link">
              <button
                type="button"
                class="link-head"
                @click.left="toggleSearch"
              >
                Search
              </button>
            </li>

            <li
              v-for="(link, idx) in contactLinks"
              :key="idx"
              :class="[ 'link', link.class ? link.class : null ]"
            >
              <router-link
                :to="link.route"
                class="link-head"
                @click.native.left="closeDrawer"
                v-html="link.name"
              />
              <div
                v-if="link.sub"
                class="drop"
              >
                <ul>
                  <li
                    v-for="(sublink, sidx) in link.sub"
                    :key="sidx"
                  >
                    <router-link
                      :to="sublink.route"
                      @click.native.left="closeDrawer"
                      v-html="sublink.name"
                    />
                  </li>
                </ul>
              </div>
            </li>
          </div>
        </ul>
      </nav>
    </div>

    <transition
      appear
      duration="650"
    >
      <search-bar
        v-if="searchOpen"
      />
    </transition>
  </header>
</template>

<script>

import { mapActions, mapState } from 'pinia';
import { useSearchStore } from '~~/stores/search';
import { useUiStore } from '~~/stores/ui';

import header from '../mixins/header';

export default {

  components: {
    Close: () => import('../svg/Close.vue')
  },

  mixins: [
    header
  ],

  data() {
    return {
      drawerOpen: false,
      dropOpen: -1
    };
  },

  computed: {
    ...mapState(useUiStore, [
      'galleryOpen'
    ])
  },

  watch: {
    $route: {
      handler() {
        if (this.drawerOpen) {
          this.drawerOpen = false;
        }
      }
    }
  },

  methods: {
    ...mapActions(useSearchStore, [
      'closeSearch'
    ]),

    closeDrawer() {
      this.drawerOpen = false;
    },

    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen;

      if (this.searchOpen) {
        this.closeSearch();
      }
    },

    toggleDrop(idx) {
      this.dropOpen = this.dropOpen === idx ? -1 : idx;
    }
  }

};

</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.bar-icon {
  left 0
  position fixed
  top 0
  z-index 11

  .bar-btn,
  .link {
    label()
    fs(12)
    pad(1.5, 1)
  }

  transition top $beat $easeOutCubic

  &.margin {
    top 30px
  }
}

.bar-cart-icon {
  left auto
  right 0
  z-index 12

  .cart {
    overflow hidden
    max-width 10em

    &.closed {
      max-width 0
      pad(.5, 0)
    }
  }
}

.header-bar {
  left 0
  position fixed
  right 0
  top 0
  pointer-events none
  z-index 12

  .store-noti {
    background $w
    body2()
    max-height 30px
    text-align center
    overflow hidden
    transition max-height $beat $easeOutCubic

    &.v-enter,
    &.v-leave-to {
      max-height 0
    }

    line-height 30px
  }

  .lockup-badge {
    pointer-events auto
    margin 0 auto
    width (6 / 12) * 100%

    div {
      pad(1, 1)
    }

    svg {
      fill $black
      margin 0 auto
      max-width 172px
      width 100%

      .dark-ui & {
        fill $w
      }
    }

    &.hide {
      opacity 0
    }

    &.show {
      opacity 1
    }
  }
}

.nav-drawer {
  background $w
  color $black
  height 100%
  left 0
  position fixed
  overflow auto
  top 0
  width 100%
  transition transform ($beat / 2) $easeOutCubic
  z-index 11

  &.drawer-closed {
    transform translateX(-100%) translateZ(0)
  }

  &.drawer-open {
    transform translateX(0%) translateZ(0)
  }

  nav {
    height 100%
    position relative
    z-index 0
  }

  .drawer-icon {
    left 0
    top 0
    position absolute
    z-index 1
  }

  .drawer-btn {
    label()
    pad(1.7, 1)

    svg {
      stroke $black

      .dark-ui & {
        stroke $w
      }
    }
  }

  .header-wrap {
    display flex
    height 100%
    flex-direction column
    justify-content center
    pad(2, 0, 2)
  }

  li {
    text-align center
    pad(0, 1)

    a {
      display inline-block
      vertical-align top
      font-smoothing()
      opacity 1
      transition opacity 150ms $easeOutCubic

      &:hover,
      &:focus {
        opacity .5

        svg {
          opacity .5
        }
      }
    }
  }

  .link-head {
    display1()
    fs(36)
    line-height (54 / 36)
    font-smoothing()
  }

  .home {
    a {
      pointer-events auto
    }
  }

  .link {
    pointer-events auto
    position relative

    &:hover {
      .drop {
        opacity 1
        pointer-events auto
      }
    }
  }

  .drop {
    max-height 0
    overflow hidden
    transition max-height ($beat / 2) $easeOutCubic

    a {
      body2()
      margin 0 0 (6 / 12em)
    }

    li:last-of-type {
      a {
        margin 0 0 (16 / 12em)
      }
    }
  }

  .open {
    .drop {
      max-height 11em
    }
  }
}

</style>
