import { mapActions, mapState } from 'pinia';
import { useShopifyStore } from '../../stores/shopify';
import { useUiStore } from '../../stores/ui';

export default {

  props: {
    shop: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // product: {},
      // variants: [],
      selectedVariant: null,
      added: 'Add to Cart'
    };
  },

  computed: {
    ...mapState(useShopifyStore, [
      'shopify',
      'checkout'
    ])
  },

  watch: {
    selectedVariant() {
      this.added = 'Add to Cart';
    }
  },

  methods: {
    ...mapActions(useUiStore, [
      'closeGallery'
    ]),
    ...mapActions(useShopifyStore, [
      'addCheckout',
      'toggleCart'
    ]),

    addToCart() {
      this.shopify.checkout.addLineItems(this.checkout.id, [
        {
          variantId: this.selectedVariant,
          quantity: 1
        }
      ]).then((checkout) => {
        this.addCheckout(checkout);
        this.added = 'Added';
        this.closeGallery();
        this.toggleCart(true);
      });
    }
  }


};
