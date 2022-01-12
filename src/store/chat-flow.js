import Vue from 'vue';
import {
  getTypeFromJSON,
  BaseType,
  CustomMessageType,
  EventMessageType,
  ImageType,
  AttachmentType,
  AudioType,
  VideoType
} from 'components-system';

import fs from 'fs';

console.log(fs);

import ChatService from "../services/chat.service";

const state = () => ({
  chat: null,
  flow: [],
  isConnectionProblem: false,
});

const getters = {
  messages: (state) => state.flow.filter(i => {
    return (i.type !== 'event' && i.type !== 'custom');
  }),
  getMessage: (state) => (id) => state.flow.find(i => i.id === id),
  isConnectionProblem: state => state.isConnectionProblem,
};

const mutations = {
  setChat(state, chat) {
    state.chat = chat;
  },
  push(state, message) {
    state.flow.push(message);
  },
  resetFlow(state) {
    state.flow = [];
  },
  setRead(state, id) {
    state.flow.find(i => {
      if (i.id === id) {
        Vue.set(i, 'read', true);
        return;
      }
    });
  },
  setConnectionProblem(state, value) {
    state.isConnectionProblem = value;
  },
};

const actions = {
  async init({ commit, dispatch }) {
    const chat = new ChatService();
    commit('setChat', chat);

    chat.onOpen(() => {
      if (chat.closeReason === 'ERR_CLOSE_CONNECTION') {
        commit('setConnectionProblem', true);
      } else {
        dispatch('getHistory');
        commit('setConnectionProblem', false);
      }
    });
    chat.onMessage((res) => {
      res.messages.forEach(i => {
        if (i.message === 'heartbeat') {
          commit('setConnectionProblem', false);
          return;
        } else if (i.message === 'ERR_CLOSE_CONNECTION') {
          commit('setConnectionProblem', true);
          return;
        }

        commit('push', getTypeFromJSON(i, chat.sender.id));
      });
    });

    await chat.init();
  },
  send({ state, commit }, message) {
    if (message instanceof BaseType) {
      state.chat.send(message.toJSON());
      commit('push', message);
    } else {
      console.error(new TypeError('message should be instance of BaseType'));
    }
  },
  sendFile({ dispatch }, file) {
    if (!file) throw new TypeError('file is required!');

    const formData = new FormData();
    formData.append('file', file);

    fetch(
      `https://qa-camptool.gupshup.io/wpp/api/user/${ChatService.sender.id}/room/${ChatService.botKey}/uploadfile`,
      {
        method: 'POST',
        body: formData
      }
    ).then(async (res) => {
      try {
        res = await res.json();
        if (res.contenttype.includes('image')) {
          dispatch('send', new ImageType.fromResponse({ ...res, name: file.name }));
        } else if (res.contenttype.includes('audio')) {
          dispatch('send', new AudioType.fromResponse({ ...res, name: file.name }));
        } else if (res.contenttype.includes('video')) {
          dispatch('send', new VideoType.fromResponse({ ...res, name: file.name }));
        } else {
          dispatch('send', new AttachmentType.fromResponse({ ...res, name: file.name }));
        }
      } catch (e) {
        throw e;
      }
    }).catch((error) => {
      console.error(error);
    });
  },
  getHistory({ commit, dispatch, state }) {
    console.info('Get history ...');
    return new Promise((resolve) => {
      commit('resetFlow');
      const callback = (res) => {
        if (!res.messages.length) {
          dispatch('send', new EventMessageType('startchatevent'));
        }

        state.chat.offMessage(callback);

        resolve();
      };
      state.chat.onMessage(callback);

      dispatch('send', new CustomMessageType('getmessages'));
    });
  },
  close({ state }) {
    state.chat.close();
  },
  async markAsRead({ commit, getters }, messageId) {
    const message = getters.getMessage(messageId);
    if (message && !message.read) {
      fetch(`${process.env.BASE_URL}/msgs/${ChatService.sender.id}/${ChatService.botKey}/read`, {
        method: 'POST',
        body: `{ id: ${messageId} }`
      });

      commit('setRead', messageId);
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
