<template lang="html">
  <div class="explorer">
    <alert :show="alertData.show" :type="alertData.type" :title="alertData.title"></alert>
    <modal v-if="modal.show" @close="modal.show = false" @submit="modal.submit" :data="modal"></modal>
    <div class="header">
      <img :src="logo">
      <input autofocus type="text" placeholder="Search for cards..." v-model="query" @keyup.enter="search">
      <br>
      <slot name="buttons"></slot>
      <ibutton icon="history" text="Recent" :click="searchRecent"></ibutton>
      <ibutton icon="plus" text="Create" :click="beginCreate"></ibutton>
    </div>

    <ul id="cards">
      <!-- <isotope :options='{}' :list="cards" @filter="filterOption=arguments[0]" @sort="sortOption=arguments[0]"> -->
        <card v-for="card in cards" @editCard="beginEdit" @deleteCard="beginDelete" v-bind:card="card" v-bind:key="card.objectID" @copy="copyAlert">
        </card>
        <p class="no-cards" v-if="!cards.length">{{noCardMessage}}</p>
      <!-- </isotope> -->
    </ul>
  </div>
</template>

<script>

  import Vue from 'vue';
  import Card from './card.vue';
  import IconButton from './ibutton.vue';
  import Modal from './modal.vue';
  import Alert from './alert.vue';

  import ExplaainSearch from '../plugins/explaain-search.js';
  import ExplaainAuthor from '../plugins/explaain-author.js';

  import Q from 'q';
  import axios from 'axios';
  import VueAxios from 'vue-axios';
  import 'vue-awesome/icons';
  import Icon from 'vue-awesome/components/Icon.vue';


  export default {
    props: [
      'userID',
      'logo',
      'algoliaParams',
      'authorParams',
    ],
    data(){
      return {
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
        },
        noCardMessage: "Type above to search for cards",
      }
    },
    created: function() {
      Vue.use(ExplaainSearch, this.algoliaParams)
      Vue.use(ExplaainAuthor, this.authorParams)
      console.log(this.userID);
      this.modal.sender = this.userID;
      this.modal.callback = this.modalCallback;
      this.$parent.$on('updateCards1', this.updateCards2);
    },
    components: {
      card: Card,
      icon: Icon,
      ibutton: IconButton,
      modal: Modal,
      alert: Alert
    },
    methods: {
      updateCards2: function(data) {
        console.log('data');
        console.log(data);
        this.cards = data.cards;
        this.noCardMessage = data.noCardMessage;
      },
      search: function() {
        const self = this;
        ExplaainSearch.searchCards(self.userID, self.query, 12)
        .then(function(hits) {
          console.log('hits');
          console.log(hits);
          self.cards = hits;
          self.noCardMessage = "No cards found";
        }).catch(function(err) {
          console.log(err);
        })
      },
      searchRecent: function() {
        const self = this;
        ExplaainSearch.searchCards(self.userID, "", 24)
        .then(function(hits) {
          self.cards = hits;
          self.noCardMessage = "No recent cards found";
        }).catch(function(err) {
          console.log(err);
        })
      },
      beginCreate: function() {
        this.modal.sender = this.userID;
        this.modal.show = true;
        this.modal.submit = ExplaainAuthor.createCard;
        delete this.modal.objectID;
        this.modal.text = '';
      },
      beginEdit: function(objectID, text) {
        this.modal.sender = this.userID;
        this.modal.show = true;
        this.modal.submit = ExplaainAuthor.editCard;
        this.modal.objectID = objectID;
        this.modal.text = text;
      },
      beginDelete: function(objectID) {
        const data = {
          sender: this.userID,
          objectID: objectID,
        }
        ExplaainAuthor.deleteCard(data)
        // this.modal = {
        //   show: true,
        //   submit: ExplaainAuthor.deleteCard,
        //   objectID: objectID,
        // }
      },
      modalCallback: function() {
        this.showAlert('success', 2000, 'Success! Update made.')
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
    margin-bottom: -0.2em;
    color: #777;
    height: 1.2em;
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

  p.no-cards {
    text-align: center;
    margin: 50px 20px;
    color: #bbb;
    font-style: italic;
  }
</style>
