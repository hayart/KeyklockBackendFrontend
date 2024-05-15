import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: localStorage.getItem('lang') || 'fr',
  fallbackLocale: 'en', // set fallback locale
});

localStorage.setItem('lang', i18n.locale)

export default i18n;
