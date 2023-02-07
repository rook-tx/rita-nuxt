import { defineStore } from 'pinia';
import Client from 'shopify-buy';

let client = null;

export const useShopifyStore = defineStore('shopify', {

  state: () => ({
    shopify: null,
    checkout: null,
    cart: null,
    collections: null,
    products: null,
    cartOpen: false
  }),

  getters: {
    // shopify: (state) => state.shopify,
    // checkout: (state) => state.checkout,
    // cart: (state) => state.cart,
    // collections: (state) => state.collections,
    // products: (state) => state.products,
    // cartOpen: (state) => state.cartOpen,
    hasItems: (state) => state.checkout?.lineItems ?
      state.checkout.lineItems.length > 0 : false
  },

  actions: {

    initShopify() {
      client = Client.buildClient({
        domain: 'ritavinieris.myshopify.com',
        storefrontAccessToken: 'bf263151f22854c6fdc8ae448b05d3ea'
      });
      this.shopify = client;
    },

    initCheckout() {
      client.checkout.create().then((checkout) => {
        this.checkout = checkout;
        // VueCookie.set('ch', checkout.id, 1);
        localStorage.addItem('ch', checkout.id)
      });
    },

    fetchCheckout() {

      // if (!VueCookie.get('ch')) {
      //   context.dispatch('initCheckout');
      //   return;
      // }

      // client.checkout.fetch(VueCookie.get('ch')).then((checkout) => {
      //   if (checkout.completedAt !== null) {
      //     context.dispatch('initCheckout');
      //   } else {
      //     context.commit('addCheckout', checkout);
      //   }
      // }).catch(() => {
        this.initCheckout();
      // });

    },

    addCheckout(checkout) {
      this.checkout = checkout;
    },

    fetchProducts() {
      client.product.fetchAll(200).then((products) => {
        this.products = products;
      });
      // return new Promise((resolve) => {
      //   client.collection.fetchByHandle('site').then((collection) => {
      //     context.commit('addProducts', collection.products);
      //     resolve();
      //   });
      // });
    },

    fetchCollections() {
      client.collection.fetchAllWithProducts().then((collections) => {
        this.collections = collections;
      });
    },

    addCart(cart) {
      this.cart = cart;
    },

    toggleCart(open) {
      this.cartOpen = open;
    }
  }

})
