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

  import Q from 'q';
  import axios from 'axios';
  import VueAxios from 'vue-axios';
  import Algolia from 'algoliasearch';
  import 'vue-awesome/icons';
  import Icon from 'vue-awesome/components/Icon.vue';

  Vue.use(VueAxios, axios)

  const AlgoliaClient = Algolia('I2VKMNNAXI', '2b8406f84cd4cc507da173032c46ee7b');
  const AlgoliaIndex = AlgoliaClient.initIndex('ForgetMeNot_Context');

  export default {
    data(){
      return {
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
        self.searchCards(self.query, 12)
        .then(function(hits) {
          console.log('hits');
          self.cards = hits
        }).catch(function(err) {
          console.log(err);
        })
      },
      fromPage: function() {
        const self = this;
        if (self.pageCards.length) {
          self.cards = self.pageCards;
        } else {
          self.getPageText()
          .then(function(text) {
            return self.searchAll(text)
          }).then(function(results) {
            console.log('results');
            console.log(results);
            self.pageCards = results;
            self.cards = results;
          }).catch(function(e) {
            console.log(e);
          })
        }
      },
      searchRecent: function() {
        console.log('searchRecent');
        const self = this;
        self.searchCards("", 24)
        .then(function(hits) {
          console.log('hits');
          self.cards = hits
        }).catch(function(err) {
          console.log(err);
        })
      },
      beginCreate: function() {
        this.modal = {
          show: true,
          submit: this.createMemory,
          text: '',
        }
      },
      createMemory: function(data) {
        const self = this;
        if (!data.text) data.text = 'Hello'
        console.log('data: ', data);
        const url = 'http://forget-me-not--staging.herokuapp.com/api/memories'
        data.sender = '1455707247850069';
        this.axios.post(url, data)
        .then((response) => {
          console.log('Card successfully created');
          console.log(response)
          self.query = '';
          self.cards = [];
          self.showAlert('success', 2000, 'Card created!')
        }).catch(function (e) {
          console.log(e);
        });
      },
      beginEdit: function(objectID, text) {
        this.modal = {
          show: true,
          submit: this.editMemory,
          objectID: objectID,
          text: text,
        }
      },
      editMemory: function(data) {
        const self = this;
        console.log('data: ', data);
        const url = 'http://forget-me-not--staging.herokuapp.com/api/memories'
        data.sender = '1455707247850069';
        this.axios.post(url, data)
        .then((response) => {
          console.log('Card successfully edited');
          console.log(response)
          self.query = '';
          self.cards = [];
          self.showAlert('success', 2000, 'Card updated!')
        }).catch(function (e) {
          console.log(e);
        });
      },
      beginDelete: function(objectID) {
        this.modal = {
          show: true,
          submit: this.deleteMemory,
          objectID: objectID,
        }
      },
      deleteMemory: function(objectID) {
        const self = this;
        const url = 'http://forget-me-not--staging.herokuapp.com/api/memories'
        const data = {
          objectID: objectID
        }
        data.sender = '1455707247850069';
        console.log('data: ', data);
        this.axios.delete(url, {params: data})
        .then((response) => {
          console.log('Card successfully deleted');
          console.log(response)
          self.query = '';
          self.cards = [];
          self.showAlert('success', 2000, 'Card deleted!')
        }).catch(function (e) {
          console.log(e);
        });
      },
      searchCards: function(searchText, hitsPerPage) {
        console.log(searchText);
        const d = Q.defer()
        const self = this;
        const params = {
    			query: searchText,
    			filters: 'userID: ' + 1455707247850069,
          hitsPerPage: hitsPerPage
    		};
        AlgoliaIndex.search(params, function(err, content) {
          if (err) {
            console.log(err);
            d.reject(err)
          } else {
            d.resolve(content.hits)
          }
        });
        return d.promise
      },

      /* For Browser Plugin Only */
      getPageText: function() {
        const d = Q.defer()
        if (this.plugin) {
          chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "readDom"},
            function(text) {
              console.log('text');
              console.log(text);
              d.resolve(text)
            });
          });
        } else {
          d.resolve("Newspeak")
        }
        return d.promise
      },
      searchAll: function(searchText) {
        console.log(searchText);
        const d = Q.defer()
        const self = this;
        const maxLength = 400;
        const searchTextArray = [];
        const hitsPerPage = Math.min(Math.max(Math.ceil(10 / (searchText.length / maxLength)), 3), 12);
        for (var i = 0; i < searchText.length; i += maxLength) {
          searchTextArray.push(searchText.substring(i, i+maxLength))
        }
        const promises = searchTextArray.map(function(t, j) {
          return self.searchCards(t, hitsPerPage);
        });
        Q.allSettled(promises)
        // promises[0]
        .then(function(results) {
          var results = [].concat.apply([], results.map(function(r) {return r.value}));
          results = self.removeDuplicates(results, 'objectID')
      		d.resolve(results)
      	})
        .catch(function(e) {
          console.log(e);
        });
        return d.promise
      },
      removeDuplicates: function(originalArray, objKey) {
        var trimmedArray = [], values = [], value;
        for(var i = 0; i < originalArray.length; i++) {
          value = originalArray[i][objKey];
          if(values.indexOf(value) === -1) {
            trimmedArray.push(originalArray[i]);
            values.push(value);
          }
        }
        return trimmedArray;
      },
      /* End Browser Plugin */
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
