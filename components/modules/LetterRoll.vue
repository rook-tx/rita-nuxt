<template>
  <div class="letter-roll">
    <span>{{ copy }}</span>
  </div>
</template>

<script>
export default {
  props: {
    copy: {
      type: String,
      default: null,
    },
  },
}
</script>

<style lang="stylus">

@import "../../assets/stylus/_variables"

.letter-roll {
	display1()
	margin 0

	+above($tablet) {
		margin 0
	}

	span {
		display inline-block
	}
}
</style>
