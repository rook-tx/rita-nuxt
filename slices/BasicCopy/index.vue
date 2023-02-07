<script setup>
import { getSliceComponentProps } from '@prismicio/vue'

defineProps({
  ...getSliceComponentProps([ 'slice' ])
})

</script>

<template>
  <div class="basic-copy">
    <div class="copy-col">
      <prismic-rich-text :field="slice.primary.copy" />
    </div>
  </div>
</template>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.basic-copy {
  mgn(0, 1, 4)

  .copy-col {
    h3 {
      display2()
    }

    p {
      body2()
      max-width 100%
      margin (16 / 12em) 0

      + h3 {
        mgn(4, 0, 1)
      }
    }
  }

  +above($notebook) {
    mgn(0, 1, 9.5)

    .copy-col {
      col(4, 10)
      margin-left 10%

      p {
        margin (18 / 14em) 0

        + h3 {
          mgn(4, 0, 1)
        }
      }
    }
  }
}

</style>
