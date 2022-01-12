<template>
  <div id="app">
    <v-app class="chat" :style="{ color: defaultFontColor, fontFamily: fontFamily, fontSize: fontSize, backgroundImage: `url(${bgImage})`}">
      <template v-if="isChatOpen">
        <div @click="close" v-if="isEmbedded" style="backgroundColor: #333">
          <img
            v-if="embeddedLogo"
            :src="embeddedLogo"
            alt=""
            :class="{
              'img-rect': embeddedLogoType === 'rectangular',
              'img-circular': embeddedLogoType === 'circular'
            }">
          <span>{{ title }}</span>
        </div>

        <ChatFlow class='main-content' />
        <div class="footer">
          <ChatInput />
          <Branding />

          <InstallPrompt v-if="isShowTooltip" />
          <NotificationsPrompt v-model="showNotificationPrompt" />
          <ConnectionProblem v-if="isConnectionProblem" />
        </div>

        <LocationModal />
        <WebviewModal />
      </template>
      <template v-else>
        <button
          :class="{
            'button-rect': closeButtonType === 'rectangular',
            'button-circular': closeButtonType === 'circular'
          }"
          @click="open"
        >
          <img
            v-if="embeddedLogo"
            :src="embeddedLogo"
            alt=""
            :class="{
              'img-rect': embeddedLogoType === 'rectangular',
              'img-circular': embeddedLogoType === 'circular'
            }">
          <span v-if="closeButtonType === 'rectangular'">{{ closeBtnText }}</span>
        </button>
      </template>
    </v-app>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ChatFlow from './components/ChatFlow';
import ChatInput from './components/ChatInput';
import LocationModal from './components/LocationModal';
import WebviewModal from './components/WebviewModal';
import ChatService from './services/chat.service';
import Branding from './components/Branding';
import InstallPrompt from './components/InstallPrompt';
import ConnectionProblem from './components/ConnectionProblem';
import NotificationsPrompt from './components/NotificationsPrompt';

export default {
  name: "App",
  components: {
    ChatFlow,
    ChatInput,
    LocationModal,
    WebviewModal,
    Branding,
    InstallPrompt,
    ConnectionProblem,
    NotificationsPrompt,
  },
  data() {
    return {
      chat: null,
      showNotificationPrompt: false,
    };
  },
  async created() {
    await Promise.all([this.$store.dispatch('theme/getConfig'), this.$store.dispatch('chatFlow/init')]);
    this.$store.dispatch('theme/init');

    if (this.$store.getters['theme/isPushNotification'] && ('Notification' in window) && !localStorage.getItem('push-notifications')) {
      this.showNotificationPrompt = true;
    }
  },
  computed: {
    ...mapGetters({
      embeddedLogoType: 'theme/embeddedLogoType',
      isEmbedded: 'theme/isEmbedded',
      isChatOpen: 'theme/isOpen',
      embeddedLogo: 'theme/embeddedLogo',
      isConnectionProblem: 'chatFlow/isConnectionProblem',
      isShowTooltip: 'theme/isShowTooltip'
    }),
    bgImage() {
      return this.$store.getters['theme/theme']?.content?.bgImage;
    },
    bgColor() {
      return this.$store.getters['theme/theme']?.common?.bgColor;
    },
    title() {
      return this.$store.getters['theme/boxConfig'].open?.text;
    },
    closeBtnText() {
      return this.$store.getters['theme/boxConfig'].close?.text;
    },
    closeButtonType() {
      return this.$store.getters['theme/boxConfig'].close?.displayType;
    },
    defaultFontColor() {
      return this.$store.getters['theme/theme'].common?.fontColor;
    },
    fontFamily() {
      return this.$store.getters['theme/theme'].content?.fontFamily;
    },
    fontSize() {
      const size = this.$store.getters['theme/theme'].content?.fontSize;
      return size && `${size}px`;
    }
  },
  methods: {
    open() {
      this.$store.dispatch('theme/open');
    },
    close() {
      this.$store.dispatch('theme/close');
    }
  },
  beforeDestroy() {
    this.$store.dispatch('chatFlow/close');
  },
};
</script>

<style lang="scss" scoped>
.chat {
  box-sizing: border-box;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-position: top center !important;
  background-attachment: fixed !important;
}

.main-content {
  padding-bottom: 80px;
}

.footer {
  width: 100vw;
  bottom: 0;
  left: 0;
  background: #fff;
  position: fixed;
  height: 80px;
  display: flex;
  flex-direction: column;
}

.img-rect {
  //
}
.img-circular {
  border-radius: 50%;
}

.button-rect {
  //
}
.button-circular {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>

<style lang="scss">
@import './styles/styles.scss';
</style>
