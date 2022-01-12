import ChatService from '../services/chat.service';

const state = () => ({
  theme: {},
  isOpen: false
});

const getters = {
  theme: state => state.theme,
  isResponsive: state => state.theme?.config?.isResponsive?.toLowerCase() === 'yes',
  isAttachment: state => state.theme?.config?.attachment?.toLowerCase() === 'yes',
  isPushNotification: state => state.theme?.config?.askPN?.toLowerCase() === 'yes',
  isGoogleTranslate: state => state.theme?.config?.glt?.toLowerCase() === 'yes',
  persistenceMenu: state => state.theme?.config?.persistenceMenu,
  isAllowHtml: state => state.theme?.config?.allowHtmlFromBot?.toLowerCase() === 'yes',
  isOpen: (state, getters) => (!getters.isEmbedded || state.isOpen),
  isEmbedded: (state, getters) => (getters.boxConfig?.open && getters.boxConfig?.close),
  embeddedLogo: state => state.theme?.common?.logo,
  embeddedLogoType: state => state.theme?.common?.imgDispType,
  boxConfig: state => ({
    open: state.theme?.openMode || null,
    close: state.theme?.closeMode || null
  }),
  btnBgColor: state => state.theme?.common?.bgColor,
  poweredBy: state => state.theme?.poweredBy,
  isRDStatus: state => state.theme?.config?.RDStatus?.toLowerCase() === 'yes',
  isUserIcon: state => state.theme?.content?.userIcon?.toLowerCase() === 'yes',
  isShowTooltip: state => state.theme?.content?.showTooltip?.toLowerCase() === 'yes',
  isWebView: state => state.theme?.config?.webView?.toLowerCase() === 'yes'
};

const mutations = {
  setConfig(state, config) {
    state.theme = config;
    try {
      state.theme = config;
      if (state.theme.config) {
        state.theme.config.persistenceMenu = state.theme.config.persistenceMenu ? JSON.parse(state.theme.config.persistenceMenu) : [];
      }
    } catch (e) {
      console.error(e);
    }
  },
  open(state) {
    state.isOpen = true;
  },
  close(state) {
    state.isOpen = false;
  }
};

const actions = {
  async getConfig({ commit }) {
    const config = ChatService.config;

    commit('setConfig', config);
  },
  init({ getters, dispatch }) {
    if (getters.isEmbedded) {
      dispatch('close');
    }

    if (getters.theme?.content?.pageTitle) {
      window.document.title = getters.theme?.content?.pageTitle;
    }
  },
  open({ commit, getters }) {
    commit('open');

    window.parent.postMessage({
      frameWidth: getters.boxConfig.open.width,
      frameHeight: getters.boxConfig.open.height
    }, '*');
  },
  close({ commit, getters }) {
    commit('close');

    window.parent.postMessage({
      frameWidth: getters.boxConfig.open.width,
      frameHeight: 50
    }, '*');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
