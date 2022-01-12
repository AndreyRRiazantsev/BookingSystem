<template>
  <div class="field">
    <Nav class="chat-btn" />
    <VInput class="chat-input" />
    <Attachment v-if="isAttachment" class="chat-btn" />

    <div v-if="googleTranslate" id="google_translate_element"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VInput from './Input';
import Attachment from './Attachment';
import Nav from './Nav';

export default {
  name: 'ChatInput',
  components: {
    VInput,
    Attachment,
    Nav
  },
  computed: {
    ...mapGetters({
      isAttachment: 'theme/isAttachment',
    }),
    googleTranslate() {
      return this.$store.getters['theme/isGoogleTranslate'];
    }
  }
};
</script>

<style lang="scss" scoped>
.field {
  display: flex;
  height: 50px;

  .chat-input {
    width: 100%;
  }
  .chat-btn {
    width: 50px;
  }
}
</style>
