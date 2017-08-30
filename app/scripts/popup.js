import Vue from 'vue';
import App from '../components/app.vue';
import Search from '../mixins/search.js';

var app = new Vue({
  el: '#app',
  render: h => h(App),
})
