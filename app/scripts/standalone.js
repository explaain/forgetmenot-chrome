import Vue from 'vue';
import Explorer from '../components/explorer.vue';

const props = {
  userID: '1455707247850069',
  logo: "../images/logo.png",
  algoliaParams: {
    appID: 'I2VKMNNAXI',
    apiKey: '2b8406f84cd4cc507da173032c46ee7b',
    index: 'ForgetMeNot_Context'
  },
  authorParams: {
    url: 'http://forget-me-not--app.herokuapp.com/api/memories'
  }
}

var app = new Vue({
  el: '#app',
  render: h => h(Explorer, {props: props}),
})
