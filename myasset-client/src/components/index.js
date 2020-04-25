import Vue from 'vue';

const requireComponent = require.context('.', false, /\.vue$/);

requireComponent.keys().forEach(fileName => {
  const component = requireComponent(fileName).default;
  Vue.component(component.name, component);
});
