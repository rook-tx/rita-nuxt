import Fuse from 'fuse.js';

// require('../../js/cms.js');

function sortYear(a, b) {
  let base = b.item.date - a.item.date;

  if (base === 0) {
    if (a.item.name < b.item.name) {
      base--;
    }
    else if (a.item.name > b.item.name) {
      base++;
    }
  }

  return base;
}

const options = {
  // isCaseSensitive: false,
  // includeScore: true,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  minMatchCharLength: 2,
  // location: 0,
  threshold: 0.25,
  distance: 1000,
  // useExtendedSearch: true,
  // ignoreLocation: true,
  // ignoreFieldNorm: true,
  sortFn: sortYear,
  keys: [
    'parent',
    'name',
    'copy'
  ]
};

import { mapActions, mapState } from 'pinia';
import ZoomOverlay from '../modules/ZoomOverlay.vue';
import SearchItem from '../modules/SearchItem.vue';
import { useDeviceStore } from '../../stores/device';
import { useUiStore } from '../../stores/ui';
import { useSearchStore } from '../../stores/search';

export default {

  components: {
    ZoomOverlay,
    SearchItem
  },

  data() {
    return {
      searchTerm: null,
      lastSearch: null,
      results: [],
      galleryIdx: 0,
      galleries: [],
      scroll: 0
    };
  },

  computed: {
    ...mapState(useDeviceStore, [
      'win',
      'mobile'
    ]),

    resultWidth() {
      const div = this.win.x < 768 ? 3 : this.win.x < 1024 ? 4 : 5;
      return Math.floor(this.win.x / div);
    },

    resultHeight() {
      return Math.floor(this.resultWidth * 6 / 4);
    },

    dimQuery() {
      return `&w=${this.resultWidth}&ar=4:6&fit=crop`;
    }
  },

  // mounted() {
  //   this.fetchDresses();
  // },

  methods: {
    ...mapActions(useUiStore, [ 'toggleGallery' ]),
    ...mapActions(useSearchStore, [ 'closeSearch' ]),

    fetchDresses() {
      this.$prismic.client.query(
        this.$prismic.Predicates.at('document.tags', [ 'search' ]),
        { pageSize: 50 }
      ).then(({ results }) => {
        this.mapPages(results);
      });
    },

    mapPages(pages) {
      let dresses = [];

      pages.forEach((page) => {
        if (page.data.body) {
          const slice = page.data.body.find((s) => s.slice_type === 'gallery_index');

          if (slice) {
            const title = page.data.body.find((s) => s.slice_type === 'basic_hero');

            const items = slice.items.map((i) => ({
              id: `${this.$prismic.richTextAsPlain(i.caption).toLowerCase()}-${page.uid}`,
              copy: this.$prismic.richTextAsPlain(i.blurb),
              name: this.$prismic.richTextAsPlain(i.caption),
              parent: this.$prismic.richTextAsPlain(title.primary.headline),
              image: i.image,
              date: this.extractDate(this.$prismic.richTextAsPlain(title.primary.headline))
            }));

            dresses = dresses.concat(items);

            this.extractGallery(slice.items, page);
          }
        }
      });

      this.fuse = new Fuse(dresses, options);

    },

    extractGallery(items, page) {

      const title = page.data.body.find((s) => s.slice_type === 'basic_hero');

      items.forEach((item) => {

        const images = [
          item.image.url
        ];

        if (item.alt_image?.url) {
          images.push(item.alt_image.url);
        }
        if (item.alt_image_2?.url) {
          images.push(item.alt_image_2.url);
        }
        if (item.alt_image_3?.url) {
          images.push(item.alt_image_3.url);
        }
        if (item.alt_image_4?.url) {
          images.push(item.alt_image_4.url);
        }

        this.galleries.push({
          id: `${this.$prismic.richTextAsPlain(item.caption).toLowerCase()}-${page.uid}`,
          section: this.$prismic.richTextAsPlain(title.primary.headline),
          images,
          headline: this.$prismic.richTextAsPlain(item.caption),
          copy: item.blurb,
          link: `${page.uid}#${this.$prismic.richTextAsPlain(item.caption)}`,
          objs: [
            item.image,
            item.alt_image,
            item.alt_image_2,
            item.alt_image_3,
            item.alt_image_4
          ]
        });
      });

    },

    extractDate(title) {
      let year = 22;
      let month = 1;

      const sidx = title.indexOf('/');

      if (sidx > -1) {
        year = title.slice(sidx + 1);
        const monthcode = title.slice(sidx - 2, sidx);

        if (monthcode === 'FW') {
          month = 6;
        }
      }

      if (title.includes('Rivini')) {
        month++;
      }

      if (title.includes('Timeless')) {
        year = 19;
      } else
      if (title.includes('Bespoke')) {
        year = 18;
      }

      return Number(`${year}${month}`);
    },

    getResults() {
      this.results = this.fuse.search(this.searchTerm.trim().replace(/\s/g, '|'));
      this.lastSearch = this.searchTerm;
      this.$refs.drawer.scrollTop = 0;
    },

    onscroll(e) {
      this.scroll = e.target.scrollTop;
    },

    activeClose() {
      this.searchTerm = null;
      this.lastSearch = null;
      this.$nextTick(this.closeSearch);
    },

    checkClear(e) {
      const term = e.target.value;
      if (!term || term.length < 1) {
        this.searchTerm = null;
        this.lastSearch = null;
        this.$nextTick(this.closeSearch);
      }
    },

    openGallery(id, e) {
      const top = e.target.offsetTop + this.$el.offsetTop - this.scroll;

      this.galleryIdx = this.galleries.findIndex((g) => g.id === id);
      this.$nextTick(this.$refs.overlay.setScale(e, top));
    },

    closeGallery() {
      this.toggleGallery(false);
      this.galleryIdx = -1;
      this.$nextTick(this.$refs.overlay.open = false);
    },

    prevSet() {
      this.closeGallery();
    },

    nextSet() {
      this.closeGallery();
    }

  }
};
