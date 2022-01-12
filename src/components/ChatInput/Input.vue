<template>
  <v-form @submit.prevent class="form">
    <input
      class="field"
      v-model="value"
      type="text"
      @keyup.enter="send"
      placeholder="Type your message here"
    />
    <v-btn @click="send" icon><v-icon>fas fa-angle-right</v-icon></v-btn>
  </v-form>
</template>

<script>
import { TextType } from 'components-system';

export default {
  name: 'Input',
  data() {
    return {
      value: null,
    };
  },
  methods: {
    send() {
      if (this.value) {
        this.$store.dispatch('chatFlow/send', new TextType(this.value));
        this.value = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: none;
  padding: 1em;
}
</style>
