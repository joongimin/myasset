import Vue from 'vue';
import App from './App.vue';
import i18n from './lib/i18n';
import router from './router';
import store from './store';

import './components';
import VFocus from './directives/v-focus';

Vue.config.productionTip = false;

Vue.directive('focus', VFocus);

new Vue({ i18n, router, store, render: h => h(App) }).$mount('#app');
