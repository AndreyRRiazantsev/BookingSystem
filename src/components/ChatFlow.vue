<template>
  <DynamicScroller
    :items="messages"
    :min-item-size="20"
    key-field="id"
    class="flow"
  >
    <template v-slot="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[
          item.id,
        ]"
        :data-index="index"
        class="flow-item"
        :class="item.isMy ? 'my' : 'his' "
      >
        <v-avatar v-if="imgSrc(item)" tile>
          <img :src="imgSrc(item)" alt="bot">
        </v-avatar>

        <Message
          :value="item"
          :is-last-message="index === messages.length - 1"
          :is-allow-html="isAllowHtml"
          :styles="styles"
          @input="onInput"
          v-in-viewport="markAsRead(item)"
        />
      </DynamicScrollerItem>
    </template>
    <!-- <button :style="styles">My button</button> -->
  </DynamicScroller>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ChatFlow',
  computed: {
    ...mapGetters({
      messages: 'chatFlow/messages',
      theme: 'theme/theme',
      isAllowHtml: 'theme/isAllowHtml',
      isUserIcon: 'theme/isUserIcon'
    }),
    styles() {
      return {
        user: {
          bubbleColor: this.theme?.content?.userBubbleColor,
          bubbleFontColor: this.theme?.content?.userFontColor,
        },
        bot: {
          bubbleColor: this.theme?.content?.botBubbleColor,
          bubbleFontColor: this.theme?.content?.botFontColor,
        }
      }
    }
  },
  watch: {
    messages() {
      this.scrollBottom();
    }
  },
  methods: {
    scrollBottom() {
      setTimeout(() => {
        const body = document.body; // Safari
        const html = document.documentElement; // Chrome, Firefox, IE and Opera places the overflow at the <html> level, unless else is specified. Therefore, we use the documentElement property for these browsers
        body.scrollTop = document.body.scrollHeight;
        html.scrollTop = document.body.scrollHeight;
      }, 10);
    },
    imgSrc(item) {
      if (item.isMy && !this.isUserIcon) {
        return null;
      }

      return item.isMy ? this.theme?.content?.user : this.theme?.content?.bot;
    },
    onInput(value) {
      if (value.type === 'webview') {
        this.$root.$emit('show:webview', value);
      } else {
        this.$store.dispatch('chatFlow/send', value);
      }
    },
    markAsRead(item) {
      if (!item.isMy && !item.isRead) {
        this.$store.dispatch('chatFlow/markAsRead', item.id);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.flow {
  margin: 0;
  padding: .5em;
  padding-bottom: 1em;
  box-sizing: border-box;

  .flow-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: .2em;

    .img {
      width: 50px;
    }

    &.my, &.his {
      .content {
        display: inline-block;
        border-radius: 3em;
        padding: .5em 1em;
        max-width: 65%;
      }
    }

    &.my {
      flex-flow: row-reverse;

      .img {
        margin-left: .5em;
      }
    }

    &.his {
      .img {
        margin-right: .5em;
      }
    }
  }
}
</style>
