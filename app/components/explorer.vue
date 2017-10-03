<template lang="html">
  <div class="explorer" v-bind:class="{sidebar: sidebar}">
    <div id="main" class="main">
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

      <button id="authorize-button" style="display: none;">Authorize</button>
      <button id="signout-button" style="display: none;">Sign Out</button>

      <ul class="cards">
        <!-- <isotope :options='{}' :list="cards" @filter="filterOption=arguments[0]" @sort="sortOption=arguments[0]"> -->
        <p class="spinner" v-if="loading"><icon name="refresh" class="fa-spin fa-3x"></icon></p>
        <p class="cards-label" v-if="pingCards.length">Match to content on the page 🙌</p>
        <card v-for="card in pingCards" v-on:cardMouseover="cardMouseover" v-on:cardMouseout="cardMouseout" v-on:cardClick="cardClick" @editCard="beginEdit" @deleteCard="beginDelete" :card="card" :key="card.objectID" :full="false" @copy="copyAlert"></card>
        <p class="cards-label" v-if="pingCards.length && cards.length">Other potentially relevant information:</p>
        <card v-for="card in cards" v-on:cardMouseover="cardMouseover" v-on:cardMouseout="cardMouseout" v-on:cardClick="cardClick" @editCard="beginEdit" @deleteCard="beginDelete" :card="card" :key="card.objectID" :full="false" @copy="copyAlert"></card>
        <p class="no-cards" v-if="!cards.length">{{noCardMessage}}</p>
        <!-- </isotope> -->
      </ul>
    </div>
    <div class="popup" v-bind:class="{ active: popupCards.length }">
      <ul class="cards">
        <p class="spinner" v-if="popupLoading"><icon name="spinner" class="fa-spin fa-3x"></icon></p>
        <card v-on-clickaway="popupClick" v-for="card in popupCards" v-on:cardMouseover="cardMouseover" v-on:cardMouseout="cardMouseout" @editCard="beginEdit" @deleteCard="beginDelete" :card="card" :key="card.objectID" full="true" @copy="copyAlert"></card>
      </ul>
    </div>
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
  import firebase from 'firebase';
  import firebaseui from 'firebaseui';
  import 'vue-awesome/icons';
  import Icon from 'vue-awesome/components/Icon.vue';
  import { mixin as clickaway } from 'vue-clickaway';



  export default {
    props: [
      'userID',
      'logo',
      'firebaseConfig',
      'algoliaParams',
      'authorParams',
      'sidebar'
    ],
    mixins: [
      clickaway
    ],
    data(){
      return {
        user: {},
        pageCards: [],
        cards: [],
        pingCards: [],
        popupCards: [],
        popupTimeout: null,
        loading: false,
        popupLoading: false,
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
      const self = this

      try {
        // Client ID and API key from the Developer Console
        var CLIENT_ID = '400087312665-71alk1rdb1lp6q9tkcgdcrj6d4u7dflb.apps.googleusercontent.com';
        var API_KEY = 'AIzaSyBU0SEu3orHAoJ5eqxIJXS2VfyqXm1HoMU';

        // Array of API discovery doc URLs for APIs used by the quickstart
        var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

        // Authorization scopes required by the API; multiple scopes can be
        // included, separated by spaces.
        var SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

        var authorizeButton = document.getElementById('authorize-button');
        var signoutButton = document.getElementById('signout-button');

        /**
         *  On load, called to load the auth2 library and API client library.
         */
        function handleClientLoad() {
          console.log(1);
          gapi.load('client:auth2', initClient);
          console.log(2);
        }


        /**
         *  Initializes the API client library and sets up sign-in state
         *  listeners.
         */
        function initClient() {
          console.log(3);
          gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
          }).then(function () {
            console.log(4);
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

            self.user.authProvider = 'google'
            self.user.id = gapi.auth2.getAuthInstance().currentUser.Ab.El // "104380110279658920175"
            console.log('self.getUser().id');
            console.log(self.getUser().id);
            setTimeout(function() {
              console.log(self.getUser().id);
            },4000)

            // Handle the initial sign-in state.
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            authorizeButton.onclick = handleAuthClick;
            signoutButton.onclick = handleSignoutClick;
          }).catch(function(e) {
            console.log(e);
          })
        }

        /**
         *  Called when the signed in status changes, to update the UI
         *  appropriately. After a sign-in, the API is called.
         */
        function updateSigninStatus(isSignedIn) {
          console.log(isSignedIn);
          if (isSignedIn) {
            authorizeButton.style.display = 'none';
            signoutButton.style.display = 'block';

            listFiles();
          } else {
            authorizeButton.style.display = 'block';
            signoutButton.style.display = 'none';
          }
        }

        /**
         *  Sign in the user upon button click.
         */
        function handleAuthClick(event) {
          gapi.auth2.getAuthInstance().signIn()
          .then(function(res) {
            self.user.authProvider = 'google'
            self.user.id = res.El
            console.log(res);
          }).catch(function(e) {
            console.log(e);
          })
        }

        /**
         *  Sign out the user upon button click.
         */
        function handleSignoutClick(event) {
          gapi.auth2.getAuthInstance().signOut();
        }

        /**
         * Append a pre element to the body containing the given message
         * as its text node. Used to display the results of the API call.
         *
         * @param {string} message Text to be placed in pre element.
         */
        function appendPre(message) {
          var pre = document.getElementById('main');
          var textContent = document.createTextNode(message + '\n');
          pre.appendChild(textContent);
        }

        /**
         * Print files.
         */
        function listFiles() {

          console.log(gapi);
          console.log(gapi.client);
          console.log(gapi.client.drive);

          gapi.client.drive.files.list({
            'pageSize': 10,
            'fields': "nextPageToken, files(id, name, mimeType)"
          }).then(function(response) {
            console.log(response);
            appendPre('Files:');
            var files = response.result.files;
            if (files && files.length > 0) {
              for (var i = 0; i < files.length; i++) {
                var file = files[i];
                appendPre(file.name + ' (' + file.id + ')');
                if (file.mimeType == 'application/vnd.google-apps.document') {
                  gapi.client.drive.files.export({
                    'fileId': file.id,
                    'mimeType': 'text/plain'
                  }).then(function(response) {
                    console.log('response');
                    console.log(response);
                    const cards = self.convertFileToCards(response.body)
                    cards.forEach(function(card) {
                      appendPre('-------\n' + card.text + '\n-------\n\n')
                    })
                    cards.splice(0,1).forEach(function(card) {
                      card.sender = self.user.id
                      card.callback = self.modalCallback;
                      ExplaainAuthor.createCard(card)
                      .then(function(res) {
                        console.log(res)
                      }).catch(function(e) {
                        console.log(e);
                      })
                    })
                    appendPre(response.body + '\n\n\n\n\n---------------------\n\n\n\n\n');
                  }).catch(function(e) {
                    console.log(e);
                  })
                }
              }
            } else {
              appendPre('No files found.');
            }
          });
        }

        console.log('handleClientLoad');
        handleClientLoad()
      } catch(e) {
        console.log(e);
      }




      Vue.use(ExplaainSearch, this.algoliaParams)
      Vue.use(ExplaainAuthor, this.authorParams)
      console.log(this.getUser().id);
      this.modal.sender = this.getUser().id;
      this.modal.callback = this.modalCallback;
      this.$parent.$on('updateCards', this.updateCards);
      this.$parent.$on('setLoading', this.setLoading);
    },
    components: {
      card: Card,
      icon: Icon,
      ibutton: IconButton,
      modal: Modal,
      alert: Alert
    },
    methods: {
      convertFileToCards: function(body) {
        const cards = []
        body.split(/(\r\n\r\n|\n\n|\r\r)/gm).forEach(function(chunk) {
          chunk = chunk.trim()
          if (chunk.length)
            cards.push({text: chunk})
        })
        return cards
      },
      getUser: function() {
        return (this.user && this.user.id) ? this.user : {id: this.userID}
      },
      cardMouseover: function(card) {
        if (this.sidebar)
          this.openPopup(card)
      },
      cardMouseout: function(card) {
        if (this.sidebar)
          this.closePopup()
      },
      cardClick: function(card) {
        const self = this
        if (!this.sidebar) {
          setTimeout(function() {
            self.openPopup(card)
          },1)
        }
      },
      popupClick: function() {
        const self = this
        if (!this.sidebar) {
          self.closePopup()
        }
      },
      openPopup: function(card) {
        this.popupCards = [card]
        console.log(this.popupTimeout);
        clearTimeout(this.popupTimeout)
      },
      closePopup: function() {
        const self = this
        console.log(self.popupTimeout);
        clearTimeout(self.popupTimeout)
        if (this.sidebar) {
          self.popupTimeout = setTimeout(function() {
            self.popupCards = []
          }, 1000)
          console.log(self.popupTimeout);
        } else {
          this.popupCards = []
        }
      },
      updateCards: function(data) {
        this.loading = false
        this.pingCards = data.cards.pings;
        this.cards = data.cards.memories;
        this.noCardMessage = data.noCardMessage;
      },
      setLoading: function() {
        this.loading = true
        this.pingCards = []
        this.cards = []
      },
      search: function() {
        const self = this;
        self.setLoading()
        ExplaainSearch.searchCards(self.getUser().id, self.query, 12)
        .then(function(hits) {
          self.loading = false
          console.log('hits')
          console.log(hits)
          self.pingCards = []
          self.cards = hits
          self.noCardMessage = "No cards found"
        }).catch(function(err) {
          console.log(err);
        })
      },
      searchRecent: function() {
        const self = this;
        self.setLoading()
        ExplaainSearch.searchCards(self.getUser().id, "", 24)
        .then(function(hits) {
          self.loading = false
          console.log('hits')
          console.log(hits)
          self.pingCards = []
          self.cards = hits
          self.noCardMessage = "No recent cards found"
        }).catch(function(err) {
          console.log(err);
        })
      },
      beginCreate: function() {
        this.modal.sender = this.getUser().id;
        this.modal.show = true;
        this.modal.submit = ExplaainAuthor.createCard;
        delete this.modal.objectID;
        this.modal.text = '';
      },
      beginEdit: function(objectID, text) {
        this.modal.sender = this.getUser().id;
        this.modal.show = true;
        this.modal.submit = ExplaainAuthor.editCard;
        this.modal.objectID = objectID;
        this.modal.text = text;
      },
      beginDelete: function(objectID) {
        const self = this
        const data = {
          sender: this.getUser().id,
          objectID: objectID,
        }
        console.log(19191);
        ExplaainAuthor.deleteCard(data)
        .then(function() {
          console.log('Deletion complete')
          self.cards.forEach(function(card, i) { //temporary - doesn't check to see whether it's actually been deleted!
            if (card.objectID == objectID) {
              self.cards.splice(i,1)
            }
          })
          self.pingCards.forEach(function(card, i) { //temporary - doesn't check to see whether it's actually been deleted!
            if (card.objectID == objectID) {
              self.pingCards.splice(i,1)
            }
          })
        })
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

<!-- // <script async defer src="https://apis.google.com/js/api.js"
//       onload="this.onload=function(){};handleClientLoad()"
//       onreadystatechange="if (this.readyState === 'complete') this.onload()">
//     </script> -->

<style lang="css">
  @import url('https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i');

  body {
    font-size: 16px;
    font-family: "Lato", Arial, sans-serif;
    color: #555;
    pointer-events: none;
  }

  .fa-icon {
    margin-bottom: -0.2em;
    color: #777;
    height: 1.2em;
  }

  .spinner {
    margin: 60px auto;
    text-align: center;
    font-size: 40px;
  }
  .spinner svg {
    width: auto;
    height: 1em; /* or any other relative font sizes */

    /* You would have to include the following two lines to make this work in Safari */
    max-width: 100%;
    max-height: 100%;
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
  .explorer {
    /*pointer-events: none;*/
  }
  .explorer .main {
    position: absolute;
    z-index: 1;
    pointer-events: all;
  }
  .explorer:not(.sidebar) .main {
    width: calc(100% - 20px);
  }

  .explorer.sidebar .main {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    right: 0;
  }

  .popup {
    position: fixed;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding-top: 200px;
  }
  .explorer.sidebar .popup {
    right: 50%;
    pointer-events: none;
  }
  .explorer .popup.active {
    pointer-events: all;
  }
  .explorer:not(.sidebar) .popup.active {
    background: rgba(0,0,0,0.2);
  }
  .popup .card {
    pointer-events: all;
  }

  input, textarea, button {
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    margin: 10px 5px;
    border: 1px solid #ddd;
  }

  input, .card {
    text-align: left;
  }
  input {
    margin: 20px;
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

  p.cards-label {
    font-weight: bold;
    margin: 20px 20px 0px;
  }


  ul {
    margin: 0;
    padding: 0;
    text-align: center;
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
