import axios from 'axios';
import {LocalStorageService} from '@/services/storage.service';
import Vue from 'vue';

const ApiService = {
  init(baseURL, store) {
    axios.defaults.baseURL = baseURL;

    axios.interceptors.request.use((config) => {
      store.commit('overlay', true)
      config.headers.common['Content-Type'] = 'application/json';
      config.headers.common['Accept-Language'] = localStorage.getItem('lang');
      if (this.getUserPrinciple().authenticated) {
        config.headers.common['Authorization'] = this.getAccessToken();
      }
      return config;
    });

    axios.interceptors.response.use(
      response => {
        store.commit('overlay', false)
        return response;
      },
      error => {
        const originalConfig = error.config;

        if (error.response === undefined || error.response.data === undefined) {
          this.logoutAndRedirectLogin();
        } else if (error.response.data.toString().includes('ECONNREFUSED') || error.response.status === 0 || error.response.status === 403) {
          this.logoutAndRedirectLogin();
        } else if (error.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          // Refresh the Keycloak token
          return new Promise((resolve) => {
            this.refreshKeycloakToken().then(() => {
              originalConfig.headers['Authorization'] = this.getAccessToken();

              // Resend the original request with the new token
              resolve(axios(originalConfig));
            });
          });
        }
        store.commit('overlay', false)
        return Promise.reject(error);
      }
    );
  },

  getUserPrinciple() {
    return LocalStorageService.getItem('user-principle');
  },

  removeHeader() {
    axios.defaults.headers.common = {};
  },

  get(resource) {
    return axios.get(resource);
  },

  post(resource, data) {
    return axios.post(resource, data);
  },

  put(resource, data) {
    return axios.put(resource, data);
  },

  delete(resource) {
    return axios.delete(resource);
  },

  customRequest(data) {
    return axios(data);
  },

  async refreshKeycloakToken() {
    const idToken = Vue.prototype.$keycloak.idToken;
    await Vue.prototype.$keycloak
      .updateToken()
      .then((refreshed) => {
        if (refreshed) {
          LocalStorageService.setItem('user-principle', Vue.prototype.$keycloak);
        } else {
          this.logoutAndRedirectLogin();
        }
      }).catch(() => {
        // As after failed update the token, adapter clears idToken,
        // but logout needs that token,
        // that why need to set idToken and then call logout
        Vue.prototype.$keycloak.idToken = idToken;
        this.logoutAndRedirectLogin();
      });
  },

  logoutAndRedirectLogin(options = {}) {
    const {
      clearStorage = false,
      clearHeader = false,
    } = options;

    const authenticated = this.getUserPrinciple().authenticated;
    const redirectUri = this.getFrontendUrl();

    if (clearHeader) {
      this.removeHeader();
    }
    if (clearStorage) {
      LocalStorageService.clear();
    }
    if (authenticated) {
      Vue.prototype.$keycloak.logout({redirectUri: redirectUri});
    } else {
      Vue.prototype.$keycloak.login({redirectUri: redirectUri});
    }
  },

  getFrontendUrl() {
    let frontendUrl = window.location.origin;
    if (process.env.VUE_APP_PROJECT_DIRECTION_PATH) {
      frontendUrl += process.env.VUE_APP_PROJECT_DIRECTION_PATH;
    }

    if (!frontendUrl.endsWith('/')) {
      frontendUrl += '/';
    }

    return frontendUrl;
  },

  getAccessToken() {
    return this.getUserPrinciple().tokenParsed.typ + '  ' + this.getUserPrinciple().token;
  }

};

export default ApiService;
