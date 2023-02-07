<script setup>
import { getSliceComponentProps } from '@prismicio/vue'

defineProps({
  ...getSliceComponentProps([ 'slice' ])
})

</script>

<template>
  <div class="image-index">
    <div class="wrap">
      <div
        v-for="(im, idx) in slice.items"
        :key="idx"
        class="image"
      >
        <div class="content">
          <modules-plax-image
            :img-obj="im.image"
          />
          <!-- :src="im.src"
          :scroll="scroll"
          :inview="inview"
          :p-top="elTop" -->
          <div class="caption">
            <prismic-rich-text
              v-if="im.caption"
              :field="im.caption"
            />
            <p>
              <nuxt-link to="/book">
                Book an appointment
              </nuxt-link>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="copy"
      class="copy"
    >
      <prismic-rich-text :field="copy" />
    </div>
  </div>
</template>

<!-- <script>

import cmsProps from '../mixins/cms-props.js';
import parallax from '../mixins/parallax.js';

export default {

  mixins: [
    cmsProps,
    parallax
  ],

  data() {
    const subject = 'Rita Vinieris Trunk Show Appointment Request';
    const body = `Hi,

My name is ____________. My wedding date is___________.

I would like to book an appointment for the Rita Vinieris Trunk Show { INSERT brand }, on { INSERT date and time }.

I am interested in the following { INSERT dress name, style, silhouette, fabric }.

{ INSERT any other comments or questions }

To confirm my appointment contact me at { INSERT e-mail } or { INSERT phone number }.`;

    return {
      images: [],
      mailLink: 'mailto:concierge@ritavinieris.com?' +
        `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    };
  }

};

</script> -->

<style lang="stylus">

@import "../../assets/stylus/_variables"

.image-index {
  position relative

  +above($tablet) {
    pad(3, 1, 5)

    .basic-hero + & {
      pad(1, 1, 5)
    }
  }

  .wrap {
    +above($tablet) {
      display flex
      flex-wrap wrap
    }
  }

  .image {
    col(5, 6)

    img {
      width 100%
    }

    +below($tablet) {
      mgn(0, 0, 3)
    }

    +above($tablet) {
      col(3, 10)
      pad(2, .5)

      &:nth-of-type(6n - 4) {
        display flex
        col(2, 10)
        pad(2, .5)
        margin 0 10%

        .content {
          margin auto
        }
      }

      &:nth-of-type(3) {
        // col(3, 10)
      }

      &:nth-of-type(6n - 2) {
        display flex
        col(2, 10)
        pad(2, .5)
        margin 0 10% 0 5%

        .content {
          margin auto
        }
      }

      &:nth-of-type(6n) {
        display flex
        col(2, 10)
        margin 0 5% 0 10%

        .content {
          margin auto
        }
      }
    }

    +below($tablet) {
      &:nth-child(even) {
        margin-left (100 / 6%)
      }
    }
  }

  .caption {
    mgn(.75, 0, 0)

    +above($tablet) {
      mgn(1, 0, 0)
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

    a {
      color $black
      display inline-block
      label()
      mgn(1, .5, 0, 0)
      vertical-align top
    }

    a[target=_blank] {
      extarrow()
      mgn(1, .5, 0, 0)
      vertical-align top

      &::after {
        margin-left .25em
      }
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
