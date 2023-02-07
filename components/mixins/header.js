import { mapState, mapActions } from 'pinia';
import { useDeviceStore } from '~~/stores/device';
import { useSearchStore } from '~~/stores/search';
import { useShopifyStore } from '~~/stores/shopify';

import Lockup from '../svg/Lockup.vue';
import CartIcon from '../ui/CartIcon.vue';
import SearchBar from '../modules/SearchBar.vue'

export default {

  components: {
    Lockup,
    CartIcon,
    SearchBar
  },

  props: {
    top: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      navLinks: [],
      contactLinks: [],
      show: true
    };
  },

  computed: {
    ...mapState(useDeviceStore, [
      'win',
    ]),
    ...mapState(useShopifyStore, [
      'cartOpen',
    ]),
    ...mapState(useSearchStore, [
      'searchOpen'
    ]),

    showStoreNoti() {
      return this.$route.name === 'veils' && this.top && !this.cartOpen;
    }
  },

  watch: {
    win: {
      immediate: true,
      handler() {
        this.$nextTick(this.logoDims);
      }
    }
  },

  created() {
    this.$prismic.client.getByType('menu').then((res) => {

      this.navLinks = this.mapPris(res.results[0].data.nav_links);
      this.contactLinks = this.mapPris(res.results[0].data.contact_links);

    });
  },

  mounted() {
    // this.$root.$on('hideLogo', this.hideLogo);
    // this.$root.$on('showLogo', () => { this.show = true; });
  },

  beforeDestroy() {
    // this.$root.$off('hideLogo', this.hideLogo);
    // this.$root.$off('showLogo', () => { this.show = true; });
  },

  methods: {
    ...mapActions(useShopifyStore, [
      'toggleCart',
    ]),
    ...mapActions(useSearchStore, [
      'toggleSearch'
    ]),

    hideLogo() {
      this.show = false;
      this.logoDims();
    },

    logoDims() {
      console.log('logoDim')
      // this.$root.$emit('logoDim', {
      //   y: this.$refs.lockup.$el.clientHeight / 2 + 30,
      //   x: this.$refs.lockup.$el.clientWidth
      // });
    },

    mapPris(links) {

      const prisLinks = links.map((l) => ({
        head: l.head,
        route: l.page.uid,
        name: l.name,
        section: l.section
      }));

      const mapLinks = [];
      let mapIdx = -1;

      for (let l of prisLinks) {
        if (!l.head) {
          mapIdx++;
          l = l.route === 'alyne' || l.route === 'rivini' ? {
            name: l.name,
            route: l.route,
            class: 'just-drop',
            sub: [
              {
                name: 'Home',
                route: l.route
              }
            ]
          } : {
            name: l.name,
            route: l.route
          };
          mapLinks.push(l);
        } else
        if (mapLinks[mapIdx].sub) {
          mapLinks[mapIdx].sub.push({
            name: l.name,
            route: l.route + (l.section ? `#${l.section.replace(/\s/g, '-').toLowerCase()}` : '')
          });
        }
      }

      return mapLinks;

    }
  }

};
