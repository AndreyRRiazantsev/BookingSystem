<template>
  <div v-if="menu.length" class="nav">
    <div v-if="isShown" class="nav-actions">
      <Navigation :menu="menu" @click="isShown = false" />
    </div>

    <button @click="onClick" :disabled="disabled" class="field-btn">
      <img v-if="imgSrc" :src="imgSrc" alt="Menu">
      <i v-else class="fas fa-bars" :style="{ color: btnBgColor }"></i>
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Navigation from './Navigation';

export default {
  name: 'Nav',
  data() {
    return {
      isShown: false,
    };
  },
  components: {
    Navigation,
  },
  computed: {
    ...mapGetters({
      persistenceMenu: 'theme/persistenceMenu',
    }),
    menu() {
      return this.persistenceMenu?.menu || [];
    },
    disabled() {
      return this.persistenceMenu?.disableinput;
    },
    btnBgColor() {
      return this.$store.getters['theme/btnBgColor'];
    },
    imgSrc() {
      return this.$store.getters['theme/theme']?.config?.perMenuImg;
    }
  },
  methods: {
    onClick() {
      this.isShown = !this.isShown;
    },
  }
};
</script>

<style lang="scss" scoped>
.nav {
  position: relative;
}

.nav-actions {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(-100%);

  ul {
    margin: 0;
    padding: 0;

    li {
      list-style-type: none;
    }
  }
}
</style>
