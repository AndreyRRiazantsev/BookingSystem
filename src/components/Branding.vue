<template>
  <div v-if="poweredBy" class="branding">
    <a class="link" v-if="poweredBy.hyperlink" :href="poweredBy.hyperlink">
      <span class="text" v-if="poweredBy.text">{{ poweredBy.text }}</span>
      <img class="img" v-if="poweredBy.image" :src="poweredBy.image" :alt="poweredBy.text">
    </a>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Branding',
  computed: {
    ...mapGetters({
      poweredBy: 'theme/poweredBy'
    })
  }
}
</script>

<style lang="scss" scoped>
.branding {
  margin: 0 auto;
}
.img {
  max-height: 20px
}
.text {
  margin-right: .5em;
  color: #3a8;
}
.link {
  color: #000;
  display: flex;
  align-items: center;
  text-decoration: none;
}
</style>
