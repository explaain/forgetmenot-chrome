import Vue from 'vue';
import App from '../components/app.vue';

var app = new Vue({
  el: '#app',
  render: h => h(App, {
    props: {
      sidebar: false
    }
  }),
})
