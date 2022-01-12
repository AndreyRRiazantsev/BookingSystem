import Vue from 'vue';
import Vuex from 'vuex';
import theme from './theme';
import chatFlow from './chat-flow';

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    theme,
    chatFlow
  },
});

export default store;
