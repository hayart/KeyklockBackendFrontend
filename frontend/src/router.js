import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import ApiService from '@/services/api.service';

Vue.use(Router);

export const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: '',
      component: () => import('.vue'),
    }
  ],
});

router.beforeEach(async (to, from, next) => {

    if (ApiService.getUserPrinciple().authenticated && !store.getters['configModule/getPermissions'].length) {
      await store.dispatch('configModule/fetchConfigs')
    }

    await store.dispatch('setShowAppNav', true);
    await store.dispatch('setShowAppFooter', true);

    if (!Vue.prototype.$keycloak.authenticated) {
      ApiService.logoutAndRedirectLogin();
    } else if (Vue.prototype.$keycloak.isTokenExpired()) {
      ApiService.refreshKeycloakToken().then(() => {
        next();
      });
    } else {
      if (to.path === '/') {
        return next('/Home.vue');
      }
      next();
    }
});

export default router;
