import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex';
import { router } from './router';
import store from './store';
import i18n_ from './i18n';
import 'bootstrap';
import { BootstrapVue, IconsPlugin, BootstrapVueIcons } from 'bootstrap-vue';
import VeeValidate from 'vee-validate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueScrollTo from 'vue-scrollto';
import UUID from 'vue-uuid';
import Keycloak from 'keycloak-js';
import { LocalStorageService } from '@/services/storage.service';

import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faUniversity,
  faCity,
  faStore,
} from '@fortawesome/free-solid-svg-icons';
import './styles/main.scss';
import ApiService from '@/services/api.service';

library.add(
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faUniversity,
  faCity,
  faStore
);

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(IconsPlugin);
Vue.use(VeeValidate, {locale: 'fr', fieldsBagName: 'veeFields'});
Vue.use(Vuex);
Vue.use(VueScrollTo);
Vue.use(UUID);

Vue.component('FontAwesomeIcon', FontAwesomeIcon);

/*
let keycloakConfig = LocalStorageService.getItem('keycloakConfig');

if (!keycloakConfig) {
  await fetch(`${process.env.VUE_APP_BASE_URL}/api/keycloak/info`)
    .then(response => response.json())
    .then(data => keycloakConfig = data)

  LocalStorageService.setItem('keycloakConfig', keycloakConfig);
}
 */
// Initialize Keycloak instance
const keycloak = new Keycloak({
  url: 'http://keycloak:8080/auth',
  realm: 'KEYAPP',
  clientId: 'app-front',
});

Vue.prototype.$keycloak = keycloak;
// Initialize Vue app after Keycloak is authenticated

keycloak.init({onLoad: 'check-sso', checkLoginIframe: false}).then(() => {
  LocalStorageService.setItem('user-principle', keycloak);
  ApiService.init(process.env.VUE_APP_BASE_URL, store);

  new Vue({
    router,
    store,
    i18n: i18n_,
    render: (h) => h(App),
  }).$mount('#app')
});
