import Vue from 'vue';
import Vuex from 'vuex';

import {configModule} from './config/config.module';

Vue.use(Vuex);

const state = {
  packageVersion: process.env.PACKAGE_VERSION || '0',
  overlay: false,
  darkTheme: false,
  showAppNav: true,
  showAppFooter: true,
};

export const getters = {
  appVersion: (state) => {
    return state.packageVersion;
  },
  getOverlay(state) {
    return state.overlay
  },
  getDarkTheme(state) {
    return state.darkTheme
  },
  getShowAppNav(state) {
    return state.showAppNav
  },
  getShowAppFooter(state) {
    return state.showAppFooter
  },
};

export default new Vuex.Store({
  state,
  mutations: {
    overlay(state, data) {
      state.overlay = data;
    },
    darkTheme(state, data) {
      state.darkTheme = data;
    },
    showAppNav(state, data) {
      state.showAppNav = data;
    },
    showAppFooter(state, data) {
      state.showAppFooter = data;
    },
  },
  actions: {
    setOverlay({commit}, data) {
      commit('overlay', data)
    },
    setDarkTheme({commit}, data) {
      commit('darkTheme', data)
    },
    setShowAppNav({commit}, data) {
      commit('showAppNav', data)
    },
    setShowAppFooter({commit}, data) {
      commit('showAppFooter', data)
    }
  },
  getters,
  modules: {
    configModule,
  },
});
