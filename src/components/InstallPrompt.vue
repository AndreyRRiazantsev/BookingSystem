<template>
  <v-snackbar :value="showInstallMessage" timeout="-1" absolute bottom>
    Install this webapp on your iPhone: tap <svg fill="rgb(113, 138, 214)	" width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
<g><path d="M780,290H640v35h140c19.3,0,35,15.7,35,35v560c0,19.3-15.7,35-35,35H220c-19.2,0-35-15.7-35-35V360c0-19.2,15.7-35,35-35h140v-35H220c-38.7,0-70,31.3-70,70v560c0,38.7,31.3,70,70,70h560c38.7,0,70-31.3,70-70V360C850,321.3,818.7,290,780,290z M372.5,180l110-110.2v552.7c0,9.6,7.9,17.5,17.5,17.5c9.6,0,17.5-7.9,17.5-17.5V69.8l110,110c3.5,3.5,7.9,5,12.5,5s9-1.7,12.5-5c6.8-6.8,6.8-17.9,0-24.7l-140-140c-6.8-6.8-17.9-6.8-24.7,0l-140,140c-6.8,6.8-6.8,17.9,0,24.7C354.5,186.8,365.5,186.8,372.5,180z"/></g>
</svg> and then "Add to Home Screen"

    <template v-slot:action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        @click="close"
      >
        <i class="fas fa-times"></i>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'InstallPrompt',
  data() {
    return {
      showInstallMessage: false,
    };
  },
  mounted() {
    const isMessage = localStorage.getItem('hideInstallMessage');

    if (this.isIos() && !this.isInStandaloneMode() && !isMessage) {
      this.showInstallMessage = true;
    }
  },
  methods: {
    close() {
      this.showInstallMessage = false;
      localStorage.setItem('hideInstallMessage', "true");
    },
    isIos() {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test( userAgent );
    },
    isInStandaloneMode() {
      return ('standalone' in window.navigator) && (window.navigator.standalone);
    }
  }
};
</script>

<style lang="scss" scoped>
.install-app {
  position: fixed;
  top: 50%;
  left: 50%;
  color: red;
}
</style>
