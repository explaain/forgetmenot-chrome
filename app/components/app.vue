<template lang="html">
  <div class="app">
    <alert :show="alertData.show" :type="alertData.type" :title="alertData.title"></alert>
    <modal v-if="modal.show" @close="modal.show = false" @submit="modal.submit" :data="modal">
      <h3 slot="header">Please enter your new memory</h3>
    </modal>
    <div class="header">
      <img :src="logo">
      <input autofocus type="text" placeholder="Search for cards..." v-model="query" @keyup.enter="search">
      <br>
      <icon-button icon="search-plus" text="Page" :click="fromPage" v-if="plugin"></icon-button>
      <icon-button icon="history" text="Recent" :click="searchRecent"></icon-button>
      <icon-button icon="plus" text="Create" :click="beginCreate"></icon-button>
    </div>

    <ul id="cards">
      <!-- <isotope :options='{}' :list="cards" @filter="filterOption=arguments[0]" @sort="sortOption=arguments[0]"> -->
        <card v-for="card in cards" @editMemory="beginEdit" @deleteMemory="deleteMemory" v-bind:card="card" v-bind:key="card.objectID" @copy="copyAlert">
        </card>
      <!-- </isotope> -->
    </ul>
  </div>
</template>

<script>

  import Vue from 'vue';
  import Card from './card.vue';
  import IconButton from './icon-button.vue';
  import Modal from './modal.vue';
  import Alert from './alert.vue';

  import Search from '../mixins/search.js';
  import Modify from '../mixins/modify.js';

  import Q from 'q';
  import axios from 'axios';
  import VueAxios from 'vue-axios';
  import 'vue-awesome/icons';
  import Icon from 'vue-awesome/components/Icon.vue';

  Vue.use(VueAxios, axios)


  export default {
    mixins: [
      Search,
      Modify
    ],
    data(){
      return {
        userID: '1455707247850069',
        plugin: true,
        logo: "../images/logo.png",
        pageCards: [],
        cards: [],
        query: '',
        modal: {
          show: false,
          text: ''
        },
        alertData: {
          show: false,
          type: '',
          title: ''
        }
      }
    },
    created: function() {
      if (this.plugin) {
        this.fromPage()
      }
    },
    components:{
      card: Card,
      icon: Icon,
      "icon-button": IconButton,
      modal: Modal,
      alert: Alert
    },
    methods: {
      search: function() {
        const self = this;
        self.searchCards(self.userID, self.query, 12)
        .then(function(hits) {
          console.log('hits');
          self.cards = hits
        }).catch(function(err) {
          console.log(err);
        })
      },
      searchRecent: function() {
        const self = this;
        self.searchCards(self.userID, "", 24)
        .then(function(hits) {
          self.cards = hits;
        }).catch(function(err) {
          console.log(err);
        })
      },
      /* For Browser Plugin Only */
      fromPage: function() {
        const self = this;
        if (self.pageCards.length) {
          self.cards = self.pageCards;
        } else {
          chrome.runtime.sendMessage({action: "getPageResults", event: "popupOpened"}, function(pageResults) {
            self.pageResults = pageResults;
            self.cards = pageResults.memories;
          });
        }
      },
      pageResults: function() {
        const d = Q.defer()
        if (this.plugin) {
          chrome.runtime.sendMessage({action: "getPageResults"},
          function(pageResults) {
            self.pageCards
            d.resolve(text)
          });
          // chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
          // });
        } else {
          d.resolve("Newspeak")
        }
        return d.promise
      },
      /* End Browser Plugin */
      beginCreate: function() {
        this.modal = {
          show: true,
          submit: this.createMemory,
          text: '',
        }
      },
      beginEdit: function(objectID, text) {
        this.modal = {
          show: true,
          submit: this.editMemory,
          objectID: objectID,
          text: text,
        }
      },
      beginDelete: function(objectID) {
        this.modal = {
          show: true,
          submit: this.deleteMemory,
          objectID: objectID,
        }
      },
      copyAlert: function() {
        this.showAlert('success', 2000, 'Copied to clipboard!')
      },
      showAlert: function(type, duration, title) {
        const self = this;
        self.alertData = {
          show: true,
          type: type,
          title: title
        }
        setTimeout(function() {
          self.alertData.show = false;
        }, duration)
      }
    }
  }
</script>

<style lang="css">
  @import url('https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i');

  body {
    font-size: 16px;
    font-family: "Lato", Arial, sans-serif;
    color: #555;
  }
  .fa-icon {
    margin-bottom: -0.125em;
    color: #777;
    height: 1.2em;
  }
  body > div.app {
    margin: auto;
    width:450px;
    min-height:800px;
  }

  .header {
    text-align: center;
  }

  .header img {
    width: 80%;
    max-width: 250px;
    display: block;
    margin: auto;
  }

  input, textarea, button {
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    margin: 10px;
    border: 1px solid #ddd;
  }

  input, .card {
    text-align: left;
  }
  input {
    width: calc(100% - 60px);
    max-width: 500px;
  }
  input:focus {
    outline:none;
  }

  button {
    background: white;
    cursor: pointer;
    color: #333;
  }
  button:hover {
    background: #eee;
  }


  ul {
    margin: 0;
    padding: 0;
  }

  li {
    list-style: none;
    display: inline-block;
    vertical-align: top;
    width: 90%;
    max-width: 300px;
  }
</style>
