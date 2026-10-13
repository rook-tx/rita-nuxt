import { mapGetters } from 'vuex';

export default {

  data() {
    return {
      scale: 2,
      padding: 50
    };
  },

  computed: {
    ...mapGetters([
      'win'
    ]),

    renderTransform() {
      return `translateY(-50%) scale(${this.scale * 1.018}) translateX(-0.4%)`;
    }
  },

  watch: {
    win: {
      immediate: true,
      handler() {
        this.updateScale();
      }
    },

    inview: {
      immediate: true,
      handler() {
        this.updateScale();
      }
    }
  },

  mounted() {
    this.$nextTick(this.updateScale);
    setTimeout(this.updateScale, 300);
  },

  methods: {
    updateScale() {
      this.scale = this.$refs.headline ?
        (this.win.x - (this.win.x < 768 ? 40 : 80)) / this.$refs.headline.clientWidth
        : 2;
      this.padding = this.$refs.scaleHeadline ?
        this.$refs.scaleHeadline.clientHeight * this.scale / 2
        : 50;
    }
  }

};
