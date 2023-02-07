<template>
  <div :class="[ 'cart-icon', { items: hasItems } ]">
    <button
      :class="iconClass"
      type="button"
      @click.left="toggleCart(!cartOpen)"
    >
      <span v-html="'Cart'" />
    </button>
    <div class="dot" />
  </div>
</template>

<script>

import { mapActions, mapState } from 'pinia'
import { useShopifyStore } from '../../stores/shopify'

export default {

  props: {
    iconClass: {
      type: String,
      default: 'drop-head'
    }
  },

  computed: {
    ...mapState(useShopifyStore, [
      'cartOpen',
      'hasItems'
    ])
  },

  methods: {
    ...mapActions(useShopifyStore, [
      'toggleCart'
    ])
  }

}

</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.cart-icon {
  position relative

  .dot {
    background $black
    height 6px
    border-radius 3px
    right -7px
    top 1px
    width 6px
    position absolute
    opacity 0

    +above($tablet) {
      right -5px
      top 3px
    }
  }

  &.items {
    .dot {
      opacity 1
    }
  }
}

</style>
