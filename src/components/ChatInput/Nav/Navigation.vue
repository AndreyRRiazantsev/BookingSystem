<template>
  <ul v-if="menu && menu.length">
    <li v-for="(item, index) in menu" :key="index">
      <button @click="sendMessage(item.title); onClick()">
        {{ item.title }}
      </button>

      <Navigation v-if="item.type === 'nested'" :menu="item.menu" @click="onClick" />
    </li>
  </ul>
</template>

<script>
import { TextType } from 'components-system';

export default {
  name: 'Navigation',
  props: {
    menu: {
      type: Array,
    },
  },
  methods: {
    sendMessage(text) {
      this.$store.dispatch('chatFlow/send', new TextType(text));
    },
    onClick() {
      this.$emit('click');
    }
  }
};
</script>

<style>

</style>
