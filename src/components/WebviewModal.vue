<template>
  <v-bottom-sheet v-model="isShown">
    <iframe :class="height" v-if="content" :src="content" frameborder="0"></iframe>
  </v-bottom-sheet>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'WebviewModal',
  data() {
    return {
      isShown: false,
      content: null,
      height: 'tall',
    };
  },
  computed: {
    ...mapGetters({
      isWebView: 'theme/isWebView',
    }),
  },
  created() {
    this.$root.$on('show:webview', (content) => {
      if (this.isWebView) {
        this.isShown = true;
        this.content = content.value;
        this.height = content.height || 'tall';
      } else {
        window.open(content.value, '_blank');
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.compact {
  min-height: 40vh;
}
.tall {
  min-height: 60vh;
}
.full {
  min-height: 100vh;
}
</style>
