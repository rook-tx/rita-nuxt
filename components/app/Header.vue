<template>
  <header>
    <div class="header">
      <transition
        appear
        duration="650"
      >
        <search-bar
          v-if="searchOpen"
        />
      </transition>

      <transition>
        <div
          v-if="showStoreNoti"
          class="store-noti"
        >
          Our veils are now shoppable online!
        </div>
      </transition>

      <nav>
        <ul class="header-wrap">
          <div class="links">
            <li
              v-for="(link, idx) in navLinks"
              :key="idx"
              :class="[ 'link', link.class ? link.class : null ]"
            >
              <nuxt-link
                :to="link.route"
                class="drop-head"
                @click.left="navClick(link.route)"
              >
                {{ link.name }}
              </nuxt-link>
              <div
                v-if="link.sub"
                class="drop"
              >
                <ul>
                  <li
                    v-for="(sublink, sidx) in link.sub"
                    :key="sidx"
                  >
                    <nuxt-link
                      :to="sublink.route"
                      @click.left="navClick(sublink.route)"
                    >
                      {{ sublink.name }}
                    </nuxt-link>
                  </li>
                </ul>
              </div>
            </li>
          </div>

          <div :class="[ 'lockup-badge', show ? 'show' : 'hide' ]">
            <li
              class="home"
            >
              <nuxt-link
                to="/"
                title="Home"
                @click.left="navClick()"
              >
                <lockup
                  ref="lockup"
                  focusable="false"
                />
              </nuxt-link>
            </li>
          </div>

          <div class="links">
            <li class="link">
              <button
                type="button"
                class="drop-head"
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
              <nuxt-link
                :to="link.route"
                class="drop-head"
                @click.left="navClick(link.route)"
              >
                {{ link.name }}
              </nuxt-link>
              <div
                v-if="link.sub"
                class="drop"
              >
                <ul>
                  <li
                    v-for="(sublink, sidx) in link.sub"
                    :key="sidx"
                  >
                    <nuxt-link
                      :to="sublink.route"
                      @click.left="navClick(sublink.route)"
                    >
                      {{ sublink.name }}
                    </nuxt-link>
                  </li>
                </ul>
              </div>
            </li>

            <li :class="[ 'link', 'cart', $route.name === 'cart' || $route.name === 'veils' ? 'open' : 'closed' ]">
              <cart-icon />
            </li>
          </div>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>

import { mapState } from 'pinia'
import { useShopifyStore } from '~~/stores/shopify'

import header from '../mixins/header'

export default {

  mixins: [
    header
  ],

  computed: {
    ...mapState(useShopifyStore, [
      'checkout'
    ])
  },

  methods: {
    mapPris(links) {

      const prisLinks = links.map((l) => ({
        head: l.head,
        route: l.page.uid,
        name: l.name,
        section: l.section
      }))

      const mapLinks = []
      let mapIdx = -1

      for (let l of prisLinks) {
        if (!l.head) {
          mapIdx++
          l = {
            name: l.name,
            route: l.route,
            sub: []
          }
          mapLinks.push(l)
        } else {
          mapLinks[mapIdx].sub.push({
            name: l.name,
            route: l.route + (l.section ? `#${l.section.replace(/\s/g, '-').toLowerCase()}` : '')
          })
        }
      }

      return mapLinks

    },

    navClick(route) {

      if (route && route === this.$route.params.slug) {
        // this.$emit('topScroll');
      } else if (!route && this.$route.name === 'home') {
        this.$emit('topScroll')
      }

      this.toggleCart(false)

    }
  }
}

</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.header {
  pointer-events none
  left 0
  position fixed
  right 0
  top 0
  z-index 20

  .store-noti {
    background $w
    body2()
    max-height 48px
    text-align center
    overflow hidden
    transition max-height $beat $easeOutCubic

    &.v-enter,
    &.v-leave-to {
      max-height 0
    }

    line-height 48px

    +above($tablet) {
      line-height 48px
    }
  }

  .header-wrap {
    align-items flex-start
    display flex
  }

  li {
    pad(0, 1)

    a {
      font-smoothing()

      &.nuxt-link-exact-active {
        &::after {
          transform-origin 0 0
          transform scaleX(1)
        }
      }
    }
  }

  .link {
    &:hover,
    &:focus,
    &:focus-within{
      .drop-head {
        // opacity .5

        &::after {
          transform-origin 0 0
          transform scaleX(1)
        }
      }
    }

    // > .nuxt-link-active {
    //   opacity .5
    // }
  }

  .home {
    a {
      pointer-events auto
    }
  }

  .links {
    display flex
    pad(1, 1)
    flex-basis (4 / 10) * 100%

    &:last-of-type {
      justify-content flex-end
    }

    li {
      white-space nowrap
    }
  }

  .link {
    pointer-events auto
    position relative

    &:hover {
      .drop {
        pointer-events auto
      }

      a {
        opacity 1
        transform translateY(0)
      }

      // .nuxt-link-exact-active {
      //   opacity .5
      // }
    }
  }

  .cart {
    overflow hidden
    max-width 5em
    transition max-width 300ms $easeInOutCubic
    transition-property max-width, padding
    position relative

    &.closed {
      max-width 0
      padding 0
    }
  }

  .drop-head {
    cursor pointer
    label()
    enterline()
    line-height (34 / 14)

    +above($tablet) {
      line-height (32 / 14)
    }
  }

  .drop {
    left 0
    pointer-events none
    position absolute
    top 100%

    li {
      display block
      body2()

      +above($tablet) {
        line-height (23 / 14)
      }

      for $i in (2..6) {
        &:nth-child({$i}) {
          a {
            transition-delay ($beat / 16) * ($i - 1)
          }
        }
      }
    }

    a {
      enterline()
      opacity 0
      transform translateY(3px)
      transition opacity ($beat / 2) $easeOutCubic
      transition-property opacity, transform

      // &:hover {
      //   opacity .5
      // }
    }
  }

  .lockup-badge {
    margin auto
    max-width (2 / 10) * $largetop * 1px
    flex-basis (2 / 10) * 100%

    li {
      pad(1.5, 0, .5)
    }

    svg {
      fill $black
      transition fill 1s $easeInOutSoft

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

</style>
