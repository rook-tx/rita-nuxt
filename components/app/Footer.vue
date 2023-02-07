<template>
  <div class="footer">
    <div class="content">
      <div class="wrap">
        <div class="seven-ten-col">
          <nav>
            <div class="sitemap">
              <div class="links">
                <ul>
                  <li
                    v-for="(link, idx) in collectionLinks"
                    :key="idx"
                    :class="[ 'link' , link.class ? link.class : null ]"
                  >
                    <nuxt-link
                      :to="link.route"
                    >
                      {{ link.name }}
                    </nuxt-link>
                  </li>
                </ul>
              </div>

              <div class="links">
                <ul>
                  <li
                    v-for="(link, idx) in exploreLinks"
                    :key="idx"
                    :class="[ 'link' , link.class ? link.class : null ]"
                  >
                    <nuxt-link
                      :to="link.route"
                    >
                      {{ link.name }}
                    </nuxt-link>
                  </li>
                </ul>
              </div>

              <div class="links">
                <ul>
                  <li
                    v-for="(link, idx) in helpLinks"
                    :key="idx"
                    :class="[ 'link' , link.class ? link.class : null ]"
                  >
                    <a
                      :href="link.route"
                    >{{ link.name }}
                    </a>
                  </li>
                </ul>
              </div>

              <div class="links">
                <ul>
                  <li
                    v-for="(link, idx) in followLinks"
                    :key="idx"
                    :class="[ 'link' , link.class ? link.class : null ]"
                  >
                    <nuxt-link
                      v-if="idx === 0"
                      :to="link.route"
                    >
                      {{ link.name }}
                    </nuxt-link>

                    <a
                      v-else
                      target="_blank"
                      rel="noopener"
                      :href="link.route"
                    >{{ link.name }}</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>

        <div
          v-if="mobile"
          class="copy-row"
        >
          <div class="copy">
            <span class="body2">&copy; 2021 Rita Vinieris</span>
          </div>

          <div class="terms">
            <div class="body2">
              <nuxt-link
                to="/shipping"
              >
                Shipping Policy
              </nuxt-link>
              <nuxt-link
                to="/terms"
              >
                Terms &amp; Conditions
              </nuxt-link>
              <nuxt-link
                to="/privacy"
              >
                Privacy Policy
              </nuxt-link>
            </div>
          </div>
        </div>

        <div class="three-ten-col">
          <div class="mailer">
            <h3 class="label header-link">
              Stay Posted
            </h3>
            <p class="body2">
              Subscribe to our newsletter to receive updates on new launches and events.
            </p>
            <div class="form-row">
              <!-- Begin Mailchimp Signup Form -->
              <div id="mc_embed_signup">
                <form
                  id="mc-embedded-subscribe-form"
                  action="https://ritavinieris.us10.list-manage.com/subscribe/post?u=2b5110f250f93c1a89ffdbb2c&amp;id=44bb29ed55"
                  method="post"
                  name="mc-embedded-subscribe-form"
                  class="validate"
                  target="_blank"
                  novalidate
                >
                  <div id="mc_embed_signup_scroll">
                    <input
                      id="mce-EMAIL"
                      type="email"
                      value=""
                      name="EMAIL"
                      class="email form-row-input"
                      placeholder="Your Email"
                      required
                    >
                    <div
                      style="position: absolute; left: -5000px;"
                      aria-hidden="true"
                    >
                      <input
                        type="text"
                        name="b_2b5110f250f93c1a89ffdbb2c_44bb29ed55"
                        tabindex="-1"
                        value=""
                      >
                    </div>
                    <div class="clear">
                      <input
                        id="mc-embedded-subscribe"
                        type="submit"
                        value="Submit"
                        name="subscribe"
                        class="button form-row-button"
                      >
                    </div>
                  </div>
                </form>
              </div>
              <!--End mc_embed_signup-->
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!mobile"
        class="copy-row"
      >
        <div class="copy">
          <span class="body2">&copy; 2022 Rita Vinieris</span>
        </div>

        <div class="terms">
          <div class="body2">
            <nuxt-link
              to="/shipping"
            >
              Shipping Policy
            </nuxt-link> | <nuxt-link
              to="/terms"
            >
              Terms &amp; Conditions
            </nuxt-link> | <nuxt-link
              to="/privacy"
            >
              Privacy Policy
            </nuxt-link>
          </div>
        </div>
      </div>

      <div class="headline">
        <svg-wordmark />
      </div>
    </div>
  </div>
</template>

<script>

import { mapState } from 'pinia'
import { useDeviceStore } from '~~/stores/device'

export default {

  data() {
    const collectionLinks = [
      {
        route: '/',
        name: 'Collections',
        class: 'header-link'
      },
      {
        route: '/rivini',
        name: 'Rivini'
      },
      {
        route: '/alyne',
        name: 'Alyne'
      },
      {
        route: '/veils',
        name: 'Veils'
      },
      {
        route: '/about#bespoke',
        name: 'Bespoke'
      }
    ]

    const exploreLinks = [
      {
        route: '/about',
        name: 'Explore',
        class: 'header-link'
      },
      {
        route: '/about',
        name: 'About Rita'
      },
      {
        route: '/the-feature',
        name: 'News & Events'
      },
      {
        route: '/find-store',
        name: 'Find a Store'
      },
      {
        route: '/find-store#trunk-shows',
        name: 'Trunk Shows'
      }
    ]

    const helpLinks = [
      {
        route: '#',
        name: 'Help',
        class: 'header-link'
      },
      // {
      //   route: 'tel:18001234567',
      //   name: '1 (800) 123 4567'
      // },
      {
        route: 'mailto:concierge@ritavinieris.com',
        name: 'concierge@ritavinieris.com'
      }
    ]

    const followLinks = [
      {
        route: '#',
        name: 'Follow',
        class: 'header-link'
      },
      {
        route: 'https://www.instagram.com/ritavinieris/',
        name: 'Instagram'
      },
      {
        route: 'https://www.twitter.com/RitaVinieris',
        name: 'Twitter'
      },
      {
        route: 'https://www.facebook.com/ritavineris/',
        name: 'Facebook'
      }
    ]

    return {
      collectionLinks,
      exploreLinks,
      helpLinks,
      followLinks,
      email: null
    }
  },

  computed: {
    ...mapState(useDeviceStore, [
      'mobile'
    ])
  }

}

</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.footer {
  background $w
  position relative
  overflow hidden
  transition background 1.3s $easeInOutSoft
  z-index 1

  .content {
    mgn(0, 0, 1)

    +above($tablet) {
      mgn(0, 1, 2)
    }
  }

  .sitemap {
    display flex

    +above($tablet) {
      justify-content space-between
    }

    +below($tablet) {
      pad(0, .5)
      flex-wrap wrap
    }
  }

  .links {
    pad(0, 1, 1, 0)
    flex-basis 50%

    +above($tablet) {
      pad(0, 1, 1.5, 0)
      flex-basis (1.4 / 7 * 100%)
    }
  }

  .link {
    body2()
    font-smoothing()
    line-height ((16 + 10) / 12)

    +above($tablet) {
      line-height ((18 + 5) / 14)
    }

    a {
      enterline()
      white-space nowrap
    }

    .nuxt-link-exact-active {
      &::after {
        transform scaleX(1)
      }
    }
  }

  .mailer {
    .label,
    .body2 {
      margin 0
    }

    .label {
      margin-bottom  (6 / 14em)
    }

    .body2 {
      // line-height (18 / 14)
      max-width 20em
    }
  }

  .header-link {
    label()
    line-height (30 / 14)
    margin-bottom (5 / 14em)

    .nuxt-link-exact-active {
      &::after {
        transform scaleX(0)
      }
    }
  }

  .headline  {
    mgn(1, 1, 0)

    +above($tablet) {
      mgn(0, 1, 1)
    }

    svg {
      display block
      width 100%
    }
  }

  .seven-ten-col,
  .three-ten-col {
    +above($tablet) {
      float left
    }

    +below($tablet) {
      width 100%
    }
  }

  .seven-ten-col {
    +below($tablet) {
      padding 0
    }
  }

  .copy-row {
    display flex

    +above($tablet) {
      justify-content space-between
      mgn(1.5, 1, 2.5)

      .copy,
      .terms {
        font-smoothing()
        white-space nowrap
      }
    }

    +below($tablet) {
      align-items flex-start
      pad(.75, .5, 1)

      .copy,
      .terms {
        width 50%
      }

      .body2 {
        display block
        font-smoothing()
      }
    }
  }

  .terms {
    a {
      enterline()

      &::after {
        bottom 2px
      }

      +below($tablet) {
        clear left
        float left
      }
    }
  }

  .dark-ui & {
    background $black
    color $w

    svg {
      fill $w
    }

    .form-row {
      border-color $w
    }
  }
}

.form-row {
  border-bottom 1px solid $black
  position relative

  &-input {
    body2()
    display block
    position relative
    white-space nowrap
    overflow hidden
    padding-right 6em
    width 100%

    // &:focus,
    // &.full {
    //   + label {
    //     opacity 0
    //   }

    //   &::placeholder {
    //     opacity .3
    //   }
    // }

    // &::placeholder {
    //   opacity 0
    // }

    &:-internal-autofill-selected {
      background $w !important
    }
  }

  label {
    opacity .6
    body2()
    top 0
    left 0
    pointer-events none
    position absolute
  }

  &-button {
    label()
    top 0
    right 0
    position absolute
  }

  &-input,
  label,
  &-button {
    font-smoothing()
    line-height (18 + (12.5 * 2)) * 1px
  }

  /* MailChimp Form Embed Code - Slim - 12/15/2015 v10.7 */
  #mc_embed_signup form {
    display:block
    position:relative
    text-align:left
  }

  #mc_embed_signup input {
    // border:1px solid #999
    -webkit-appearance:none
  }

  #mc_embed_signup input[type=checkbox]{
    -webkit-appearance:checkbox
  }

  #mc_embed_signup input[type=radio]{
    -webkit-appearance:radio
  }

  #mc_embed_signup input:focus {
    border-color:#333
  }

  #mc_embed_signup .button {
    // clear:both
    // background-color: #aaa
    // border: 0 none
    // border-radius:4px
    // letter-spacing:.03em
    // color: #FFFFFF
    // cursor: pointer
    // display: inline-block
    // font-size:15px
    // height: 32px
    // line-height: 32px
    // margin: 0 5px 10px 0
    // padding:0
    // text-align: center
    // text-decoration: none
    // vertical-align: top
    // white-space: nowrap
    // width: auto
    // transition: all 0.23s ease-in-out 0s
  }

  #mc_embed_signup .button:hover {
    // background-color:#777
  }

  #mc_embed_signup .small-meta {
    font-size: 11px
  }

  #mc_embed_signup .nowrap {
    white-space:nowrap
  }

  #mc_embed_signup .clear {
    clear:none
    display:inline
  }

  #mc_embed_signup label {
    display:block
    // font-size:16px
    // padding-bottom:10px
    // font-weight:bold
  }

  #mc_embed_signup input.email {
    display:block
    // padding:0 0.4em
    // margin:0 4% 10px 0
    // min-height:32px
    // width:58%
    // min-width:130px
    // -webkit-border-radius: 3px
    // -moz-border-radius: 3px
    // border-radius: 3px
  }

  #mc_embed_signup input.button {
    display:block
    // width:35%
    // margin:0 0 10px 0
    // min-width:90px
  }

  #mc_embed_signup div#mce-responses {
    float:left
    top:-1.4em
    padding:0em .5em 0em .5em
    overflow:hidden
    width:90%
    argin: 0 5%
    clear: both
  }

  #mc_embed_signup div.response {
    margin:1em 0
    padding:1em .5em .5em 0
    font-weight:bold
    float:left
    top:-1.5em
    z-index:1
    width:80%
  }

  #mc_embed_signup #mce-error-response {
    display:none
  }

  #mc_embed_signup #mce-success-response {
    color:#529214
    display:none
  }

  #mc_embed_signup label.error {
    display:block
    float:none
    width:auto
    margin-left:1.05em
    text-align:left
    padding:.5em 0
  }

  #mc_embed_signup {
    // background:#fff;
    // clear:left;
    // font:14px Helvetica,Arial,sans-serif;
  }
}

</style>
