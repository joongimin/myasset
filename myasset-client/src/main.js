import Vue from 'vue';
import App from './App.vue';
import i18n from './lib/i18n';
import router from './router';
import store from './store';

import './scss/main.scss';

import './components';
import VFocus from './directives/v-focus';
import VTooltip from './directives/v-tooltip';

Vue.config.productionTip = false;

Vue.directive('focus', VFocus);
Vue.directive('tooltip', VTooltip);

new Vue({ i18n, router, store, render: h => h(App) }).$mount('#app');
