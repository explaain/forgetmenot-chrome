import Vue from 'vue';
import Explorer from '../components/explorer.vue';

const props = {
  userID: '',
  logo: "http://explaain.com/img/logo.png",
  algoliaParams: {
    appID: 'I2VKMNNAXI',
    apiKey: '2b8406f84cd4cc507da173032c46ee7b',
    index: 'cards'
  },
  authorParams: {
    url: 'http://forget-me-not--app.herokuapp.com/api/memories'
  }
}

var app = new Vue({
  el: '#app',
  render: h => h(Explorer, {props: props}),
})
