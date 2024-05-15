import RoleService from '../../services/role/role.service';
import AuthInfoService from '../../services/config.service';
import {LocalStorageService} from '../../services/storage.service';


export const configModule = {
  namespaced: true,
  state: {
    config: {
      permissions: [],
      roles: []
    }
  },
  mutations: {
    authInfo(state, data) {
      state.config = Object.assign(state.config, data);
    },
    roles(state, data) {
      state.config = Object.assign(state.config, data);
    }
  },
  actions: {
    async fetchConfigs({ dispatch }) {
      await dispatch('fetchAuthInfo')
      await dispatch('fetchRoles')
    },
    async fetchRoles({ commit }) {
      await RoleService.getRoles().then(async (resp) => {
        await commit('roles', resp.data)
      })
    },
    async fetchAuthInfo({ commit }) {
      await AuthInfoService.getAuthInfo().then(resp => {
        commit('authInfo', resp.data)
        LocalStorageService.setItem('permissions', resp.data.permissions);
      })
    }
  },
  getters: {
    getRoles(state){
      return state.config.roles
    },
    getConfig(state){
      return state.config
    },
    getPermissions(state){
      return state.config.permissions
    }
  },
}