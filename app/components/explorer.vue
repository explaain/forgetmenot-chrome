<template lang="html">
  <div class="explorer" v-bind:class="{sidebar: sidebar}">
    <div id="main" class="main">
      <alert :show="alertData.show" :type="alertData.type" :title="alertData.title"></alert>
      <modal v-if="modal.show" @close="modal.show = false" @submit="modal.submit" :data="modal"></modal>
      <div class="header">
        <img :src="logo">
        <input autofocus type="text" placeholder="Search for cards..." v-model="query" @keyup.enter="search"><br>
        <slot name="buttons"></slot>
        <ibutton v-if="local" icon="code" text="Local" :click="searchTempLocal"></ibutton>
        <ibutton icon="history" text="Recent" :click="searchRecent"></ibutton>
        <ibutton icon="plus" text="Create" :click="beginCreate"></ibutton>
      </div>

      <ul class="cards">
        <p class="spinner" v-if="loading && loader == -1"><icon name="refresh" class="fa-spin fa-3x"></icon></p>
        <p class="loader-text" v-if="loader != -1">Importing and processing content...</p>
        <div class="loader" v-if="loader != -1"><div :style="{ width: loader + '%' }"></div></div>
        <p class="loader-card-text" v-if="loader != -1">{{loaderCards}} cards generated</p>
        <p class="cards-label" v-if="pingCards.length">Match to content on the page 🙌</p>
        <card v-for="card in pingCards" @cardMouseover="cardMouseover" @cardMouseout="cardMouseout" @cardClick="cardClick" @updateCard="updateCard" @deleteCard="beginDelete" :data="card" :key="card.objectID" :full="false" :allCards="allCards" :setCard="setCard" :getUser="getUser" @copy="copyAlert"></card>
        <p class="cards-label" v-if="pingCards.length && cards.length">Other potentially relevant information:</p>
        <card v-for="card in cards" @cardMouseover="cardMouseover" @cardMouseout="cardMouseout" @cardClick="cardClick" @updateCard="updateCard" @deleteCard="beginDelete" :data="card" :key="card.objectID" :full="false" :allCards="allCards" :setCard="setCard" :getUser="getUser" @copy="copyAlert"></card>
        <p class="no-cards" v-if="!cards.length">{{noCardMessage}}</p>
      </ul>
    </div>
    <div class="popup" v-bind:class="{ active: popupCards.length }" @click.self="popupFrameClick">
      <ul @click.self="popupFrameClick" class="cards">
        <p class="spinner" v-if="popupLoading"><icon name="spinner" class="fa-spin fa-3x"></icon></p>
        <card v-for="card in popupCards" @cardMouseover="cardMouseover" @cardMouseout="cardMouseout" @cardClick="cardClick" @updateCard="updateCard" @deleteCard="beginDelete" :data="card" :key="card.objectID" :full="true" :allCards="allCards" :setCard="setCard" :getUser="getUser" @copy="copyAlert"></card>
      </ul>
    </div>
  </div>
</template>



<script>

  import Vue from 'vue';
  import Q from 'q';
  import axios from 'axios';
  import VueAxios from 'vue-axios';
  import firebase from 'firebase';
  import firebaseui from 'firebaseui';
  import Draggable from 'vuedraggable';
  import 'vue-awesome/icons';
  import Icon from 'vue-awesome/components/Icon.vue';
  import Card from './card.vue';
  import IconButton from './ibutton.vue';
  import Modal from './modal.vue';
  import Alert from './alert.vue';
  import ExplaainSearch from '../plugins/explaain-search.js';
  import ExplaainAuthor from '../plugins/explaain-author.js';



  export default {
    props: [
      'userID',
      'logo',
      'firebaseConfig',
      'algoliaParams',
      'authorParams',
      'sidebar',
      'local'
    ],
    data(){
      return {
        user: {},
        pageCards: [],
        allCards: {},
        mainCardList: [],
        pingCards: [],
        popupCards: [],
        popupTimeout: null,
        loading: false,
        loader: -1,
        loaderCards: 0,
        popupLoading: false,
        query: '',
        lastQuery: '',
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
    computed: {
      cards: function() {
        const self = this
        const watchThis = self.allCards // This does nothing other than force this function to watch for changes in self.allCards
        return self.mainCardList ? self.mainCardList.map(function(objectID) {
          return self.allCards[objectID] || { description: 'Card Not Found' }
        }) : []
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
          gapi.load('client:auth2', initClient);
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

            if (getParameterByName('import') == 'true')
              importFromFiles()
          } else {
            authorizeButton.style.display = 'block';
            signoutButton.style.display = 'none';
            handleAuthClick()
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
          var textContent = document.createElement('p')
          textContent.appendChild(document.createTextNode(message))
          pre.appendChild(textContent);
        }

        function resetDb() {
          const d = Q.defer()
          if (self.getUser().id == '101118387301286232222') {
            self.deleteAllCards()
            .then(function() {
              const initialCards = [
                {
                  "context": [],
                  "entities": {},
                  "intent": "setTask.URL",
                  "sender": "101118387301286232222",
                  "sentence": "TechCrunch News:\r\n\r\nMACE has raised £500k from Angel List to help its efforts expanding the company's business SaaS model. Customers include Disney, Adobe and YouTube.",
                  "hasAttachments": true,
                  "userID": "101118387301286232222",
                  "dateCreated": 1507109266738,
                  "triggerURL": "mail.google.com",
                  "actionSentence": "Breaking news",
                  "attachments": [
                    {
                      "type": "image",
                      "url": "https://s0.wp.com/wp-content/themes/vip/techcrunch-2013/assets/images/techcrunch.opengraph.default.png"
                    }
                  ],
                },
                {
                  "context": [],
                  "entities": {},
                  "intent": "setTask.URL",
                  "sender": "101118387301286232222",
                  "sentence": "MACE vs ACME Competitor Analysis:\r\n\r\n- They don't integrate with AWS\r\n- They don't offer a free trial\r\n- Customer satisfaction in 3* on Trustpilot vs us at 4.5*\r\n- They don't have case studies",
                  "hasAttachments": false,
                  "userID": "101118387301286232222",
                  "dateCreated": 1507109266738,
                  "triggerURL": "mail.google.com",
                  "actionSentence": "Breaking news",
                },
              ]
              const promises = initialCards.map(function(card) {
                return ExplaainAuthor.saveCard(card)
              })
              return Q.allSettled(promises)
            }).then(function() {
              console.log('yoyoyoyoyoyo');
              d.resolve()
            }).catch(function(e) {
              d.reject(e)
            })
          } else {
            d.resolve()
          }
          return d.promise
        }

        /**
         * Print files.
        */
        function importFromFiles() {

          self.setLoading()

          console.log(gapi);
          console.log(gapi.client);
          console.log(gapi.client.drive);

          resetDb()
          .then(function() {
            return gapi.client.drive.files.list({
              'pageSize': 10,
              'fields': "nextPageToken, files(id, name, mimeType)"
            })
          }).then(function(response) {
            console.log(response);
            var files = response.result.files;
            if (files && files.length > 0) {
              const win = []
              const lose = []
              var cardsCounted = 0
              const filePromises = files.filter(function(file) {
                return file.mimeType == 'application/vnd.google-apps.document'
              }).map(function(file, i, filteredFiles) {
                return gapi.client.drive.files.export({
                  'fileId': file.id,
                  'mimeType': 'text/plain'
                }).then(function(response) {
                  const cards = self.convertFileToCards(response.body, file)
                  cardsCounted += cards.length
                  cards.forEach(function(card) {
                    // appendPre(card.text)
                  })
                  const savePromises = cards.map(function(card) {
                    card.sender = self.user.id
                    card.callback = self.modalCallback;
                    console.log(card);
                    return ExplaainAuthor.saveCard(card)
                    .then(function(res) {
                      self.loaderCards++
                      self.loader = 100*(self.loaderCards/cardsCounted)
                    }).catch(function(e) {
                      console.log(e);
                    })
                  })
                  return Q.allSettled(savePromises)
                }).then(function(res) {
                }).catch(function(e) {
                  console.log(e);
                })
              })
              Q.allSettled(filePromises)
              .then(function(res) {
                self.loader = -1
                console.log(res);
                console.log(win);
                console.log(lose);
                self.searchRecent()
              }).catch(function(e) {
                console.log(e);
                self.searchRecent()
              })
            } else {
              appendPre('No files found.');
            }
          });
        }


        console.log('handleClientLoad');
        if (!this.local) {
          handleClientLoad()
        }
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
      alert: Alert,
      draggable: Draggable,
    },
    methods: {
      convertFileToCards: function(body, file) {
        const cards = []
        body.split(/(\r\n\r\n\r\n|\n\n\n|\r\r\r)/gm).forEach(function(chunk) {
          chunk = chunk.trim()
          if (chunk.length)
            cards.push({
              description: chunk,
              extractedFrom: {
                title: file.name,
                url: file.webContentLink // Could be webViewLink?
              }
            })
        })
        return cards
      },
      getUser: function() {
        return (this.user && this.user.id) ? this.user : {id: this.userID}
      },
      getCard: function(objectID) {
        return this.allCards[objectID]
      },
      setCard: function(objectID, card) {
        const self = this
        Vue.set(self.allCards, objectID, card) // Forces this to be watched
      },
      setCardProperty: function(objectID, property, value) {
        const self = this
        const card = self.allCards[objectID]
        card[property] = value
        Vue.set(self.allCards, objectID, card) // Forces this to be watched - not yet working, at least with 'updating'
      },
      cardMouseover: function(card) {
        if (this.sidebar)
          this.openPopup(card)
      },
      cardMouseout: function() {
        if (this.sidebar)
          this.closePopup()
      },
      cardClick: function(card) {
        const self = this
        if (!this.sidebar) {
          setTimeout(function() { // Is this timeout stil necessary?
            self.openPopup(card)
          },1)
        }
      },
      popupClickaway: function(event) {
        const self = this
        if (!this.sidebar) {
          self.closePopup()
        }
      },
      popupFrameClick: function() {
        const self = this
        console.log('popupFrameClick');
        if (this.sidebar) {
          self.closePopup(true)
          self.$emit('closeDrawer')
        } else {
          self.closePopup()
        }
      },
      openPopup: function(card) {
        this.popupCards = [card]
        clearTimeout(this.popupTimeout)
      },
      closePopup: function(instantly) {
        const self = this
        self.editing = false // This should be for every card so currently does nothing
        clearTimeout(self.popupTimeout)
        if (this.sidebar && !instantly) {
          self.popupTimeout = setTimeout(function() {
            self.popupCards = []
          }, 1000)
        } else {
          this.popupCards = []
        }
      },
      updateCards: function(data) {
        this.loading = false
        this.pingCards = data.cards.pings;
        // this.cards = data.cards.memories;
        this.mainCardList = data.cards.memories.map(function(card) { return card.objectID })
        this.noCardMessage = data.noCardMessage;
      },
      setLoading: function() {
        this.loading = true
        this.pingCards = []
        this.mainCardList = []
      },
      search: function() {
        const self = this;
        self.setLoading()
        self.lastQuery = self.query
        ExplaainSearch.searchCards(self.getUser().id, self.query, 12)
        .then(function(hits) {
          self.loading = false
          self.pingCards = []
          // self.cards = hits
          self.mainCardList = hits.map(function(card) { return card.objectID })
          self.noCardMessage = "No cards found"
          hits.forEach(function(hit) {
            self.setCard(hit.objectID, hit)
          })
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
          // self.cards = hits
          self.mainCardList = hits.map(function(card) { return card.objectID })
          self.noCardMessage = "No recent cards found"
          hits.forEach(function(hit) {
            self.setCard(hit.objectID, hit)
          })
        }).catch(function(err) {
          console.log(err);
        })
      },
      searchTempLocal: function() {
        const self = this;
        const hits = [{"intent":"storeMemory","sender":"1627888800569309","listItems":["620064670","620064680","620064690","620064700"],"hasAttachments":false,"userID":"1627888800569309","dateUpdated":1508426117869,"objectID":"619948630","description":"Inject Meeting Notes"},{"intent":"storeMemory","sender":"1627888800569309","hasAttachments":false,"userID":"1627888800569309","dateUpdated":1508426117257,"objectID":"620064700","description":"Keep all signed timesheets and receipts"},{"intent":"storeMemory","sender":"1627888800569309","hasAttachments":false,"userID":"1627888800569309","dateUpdated":1508426117225,"objectID":"620064690","description":"Business model => pro version only"},{"intent":"storeMemory","sender":"1627888800569309","hasAttachments":false,"userID":"1627888800569309","dateUpdated":1508426117152,"objectID":"620064680","description":"Languages"},{"intent":"storeMemory","sender":"1627888800569309","hasAttachments":false,"userID":"1627888800569309","dateUpdated":1508426116967,"objectID":"620064670","description":"Finish card creation & editing"},{"intent":"storeMemory","sender":"1627888800569309","hasAttachments":false,"userID":"1627888800569309","dateCreated":1508425700874,"dateUpdated":1508425700874,"objectID":"651610261","description":"Asdf"},{"intent":"storeMemory","sender":"1627888800569309","listItems":["645331361","610938240","610473050"],"hasAttachments":false,"userID":"1627888800569309","dateUpdated":1508421510702,"objectID":"639442471","description":"Here is a list"},{"intent":"storeMemory","sender":"1627888800569309","hasAttachments":false,"userID":"1627888800569309","dateUpdated":1508421509549,"objectID":"610938240","description":"This is a brand new list"},{"intent":"storeMemory","sender":"1627888800569309","hasAttachments":false,"userID":"1627888800569309","dateUpdated":1508421508835,"objectID":"645331361","description":"A serious item"},{"intent":"storeMemory","sender":"1627888800569309","hasAttachments":false,"userID":"1627888800569309","dateUpdated":1508421508588,"objectID":"610473050","description":"Another list item"}]
        // self.cards = hits
        self.mainCardList = hits.map(function(card) { return card.objectID })
        self.noCardMessage = "No recent cards found"
        hits.forEach(function(hit) {
          self.setCard(hit.objectID, hit)
        })
      },
      beginCreate: function() {
        this.modal.sender = this.getUser().id;
        this.modal.show = true;
        console.log(222)
        this.modal.submit = ExplaainAuthor.saveCard
        // .then(function() {
        //   console.log(333)
        // })
        delete this.modal.objectID;
        this.modal.text = '';
      },
      beginDelete: function(objectID) {
        const self = this
        self.closePopup()
        self.deleteCard(objectID)
        .then(function() {
          console.log('Deletion complete')
          self.mainCardList.forEach(function(cardID, i) { //temporary - doesn't check to see whether it's actually been deleted!
            if (cardID == objectID) {
              self.cards.splice(i,1)
            }
          })
          self.pingCards.forEach(function(card, i) { //temporary - doesn't check to see whether it's actually been deleted!
            if (card.objectID == objectID) {
              self.pingCards.splice(i,1)
            }
          })
        })
      },
      deleteCard: function(objectID) {
        const d = Q.defer()
        const data = {
          sender: this.getUser().id,
          objectID: objectID
        }
        ExplaainAuthor.deleteCard(data)
        .then(function() {
          d.resolve()
        }).catch(function(e) {
          console.log(e);
          d.reject(e)
        })
        return d.promise
      },
      deleteAllCards: function() {
        console.log('Deleting all cards...!!!')
        const d = Q.defer()
        const self = this
        ExplaainSearch.searchCards(self.getUser().id, "", 50)
        .then(function(hits) {
          const promises = hits.map(function(card) {
            return self.deleteCard(card.objectID)
          })
          console.log(promises);
          Q.allSettled(promises)
          .then(function() {
            console.log('hihihihihihi');
            d.resolve()
          }).catch(function(e) {
            d.reject(e)
          })
        }).catch(function(e) {
          console.log(e);
          d.reject(e)
        })
        return d.promise
      },
      updateCard: function(data, callback, errorCallback) {
        const self = this
        const promises = []
        if (data.content && data.content.listCards && data.content.listCards.length) {
          data.content.listCards.forEach(function(listCard, index) {
            const p = Q.defer()
            if (!listCard.objectID || listCard.objectID.indexOf('TEMP') == 0) {
              if (listCard.objectID) delete listCard.objectID
              listCard.intent = 'storeMemory'
              listCard.sender = self.getUser().id
            }
            console.log('hi');
            self.saveCard(listCard)
            .then(function(savedListCard) {
              data.content.listItems[index] = savedListCard.objectID // In case it was a new listCard. This also relies on the index still being correct after the asynchronous delay
              p.resolve()
            }).catch(function(e) {
              p.reject(e)
            })
            promises.push(p.promise)
          })
        }
        console.log('hello');
        Q.allSettled(promises)
        .then(function() {
          self.saveCard(data)
          callback()
        }).catch(function(e) {
          console.log(e);
          errorCallback(e)
        })
      },
      saveCard: function(card) {
        const d = Q.defer()
        const self = this
        if (card.content && card.content.listCards) delete card.content.listCards
        if (self.getCard(card.objectID)) self.setCardProperty(card.objectID, 'updating', true)
        console.log('yo');
        ExplaainAuthor.saveCard(card)
        .then(function(res) {
          // card.objectID = res.data.memories[0].objectID // In case it was a new card
          const returnedCard = res.data.memories[0]
          card.objectID = returnedCard.objectID
          card.updating = false
          self.setCard(returnedCard.objectID, card)
          // self.setCardProperty(returnedCard.objectID, 'objectID', returnedCard.objectID) // In case it was a new card
          // self.setCardProperty(returnedCard.objectID, 'updating', false)
          d.resolve(card)
        }).catch(function(e) {
          console.error(e);
          d.reject(e)
        })
        console.log('yo1');
        return d.promise
      },
      modalCallback: function(message) {
        const self = this
        this.showAlert('success', 2000, message || 'Success! Update made.')
        const query = this.lastQuery
        setTimeout(function() {
          self.query = query
          self.search()
        },1000)
      },
      copyAlert: function() {
        this.showAlert('success', 2000, 'Copied to clipboard!')
      },
      showAlert: function(type, duration, title) {
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

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
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
  body div:not(.popup), body button {
    pointer-events: all;
  }

  .main p {
    margin: 50px 10px;
  }

  .fa-icon {
    margin-bottom: -0.2em;
    color: #777;
    height: 1.2em;
  }

  .loader-text {
    font-size: 30px;
    font-weight: bold;
    color: #999;
    margin-bottom: 20px;
  }
  .loader-card-text {
    font-size: 24px;
    margin-top: 20px;
  }

  .loader {
    position: relative;
    margin: 30px auto;
    height: 60px;
    max-width: 500px;
    width: calc(100% - 100px);
    background: #ddd;
  }
  .loader > div {
    height: 100%;
    background: #ffd51c;
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
    padding: 20px;
  }

  .header img {
    width: 80%;
    max-width: 250px;
    display: block;
    margin: 10px auto;
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
    z-index: 100;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 180px 10px 60px;
    text-align: center;
    pointer-events: none;
  }
  .explorer.sidebar .popup {
    right: 50%;
    pointer-events: all;
  }
  .explorer .popup.active {
    pointer-events: all;
    overflow: scroll;
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
    width: calc(100% - 82px);
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


  .cards {
    margin: 0;
    padding: 0;
    text-align: center;
  }

  li { /* Is this even being used anymore? */
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
