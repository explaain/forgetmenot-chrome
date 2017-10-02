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

    <!-- <div id="firebaseui-auth-container"></div>
    <div id="sign-in-status"></div>
    <button id="sign-in-out" @click="toggleSignIn"></button>
    <div id="account-details"></div> -->

    <!--Add buttons to initiate auth sequence and sign out-->
    <button id="authorize-button" style="display: none;">Authorize</button>
    <button id="signout-button" style="display: none;">Sign Out</button>

    <ul id="cards">
      <!-- <isotope :options='{}' :list="cards" @filter="filterOption=arguments[0]" @sort="sortOption=arguments[0]"> -->
        <p class="spinner" v-if="loading"><icon name="refresh" class="fa-spin fa-3x"></icon></p>
        <p class="cards-label" v-if="pingCards.length">Match to content on the page 🙌</p>
        <card v-for="card in pingCards" @editCard="beginEdit" @deleteCard="beginDelete" :card="card" :key="card.objectID" @copy="copyAlert"></card>
        <p class="cards-label" v-if="pingCards.length && cards.length">Other potentially relevant information:</p>
        <card v-for="card in cards" @editCard="beginEdit" @deleteCard="beginDelete" :card="card" :key="card.objectID" @copy="copyAlert"></card>
        <p class="no-cards" v-if="!cards.length">{{noCardMessage}}</p>
      <!-- </isotope> -->
    </ul>
  </div>
  <!-- <div class="popup">
    <ul id="cards">
      <p class="spinner" v-if="popupLoading"><icon name="spinner" class="fa-spin fa-3x"></icon></p>
      <card v-for="card in popupCards" @editCard="beginEdit" @deleteCard="beginDelete" :card="card" :key="card.objectID" @copy="copyAlert"></card>
    </ul>
  </div> -->
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



  export default {
    props: [
      'userID',
      'logo',
      'firebaseConfig',
      'algoliaParams',
      'authorParams',
    ],
    data(){
      return {
        user: {},
        pageCards: [],
        cards: [],
        pingCards: [],
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
          var pre = document.getElementById('content');
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

          try {
            gapi.client.drive.about.get({
              'resourceName': 'people/me',
              'requestMask.includeField': 'person.names',
              'fields': ['user']
            }).then(function(res) {
              console.log('res');
              console.log(res);
            })
          } catch(e) {
            console.log(e);
          }

          try {
            gapi.client.drive.about.get({
              'resourceName': 'people/me',
              'fields': ['user']
            }).then(function(res) {
              console.log('res');
              console.log(res);
            })
          } catch(e) {
            console.log(e);
          }

          try {
            gapi.client.drive.about.get({
              'fields': ['user']
            }).then(function(res) {
              console.log('res');
              console.log(res);
            })
          } catch(e) {
            console.log(e);
          }

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
                    // appendPre(response.body + '\n\n\n\n\n---------------------\n\n\n\n\n');
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




      // firebase.initializeApp(this.firebaseConfig)
      //
      // var uiConfig = {
      //   signInOptions: [
      //     // Leave the lines as is for the providers you want to offer your users.
      //     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      //     // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      //     // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      //     // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      //     // firebase.auth.EmailAuthProvider.PROVIDER_ID,
      //     // firebase.auth.PhoneAuthProvider.PROVIDER_ID
      //   ],
      //   // Terms of service url.
      //   tosUrl: 'http://forgetmenot.explaain.com/',
      //   callbacks: {
      //     signInSuccess: function(currentUser, credential, redirectUrl) {
      //       return false;
      //     }
      //   }
      // };
      // // Initialize the FirebaseUI Widget using Firebase.
      // var ui = new firebaseui.auth.AuthUI(firebase.auth());
      // // The start method will wait until the DOM is loaded.
      // ui.start('#firebaseui-auth-container', uiConfig);
      //
      //
      // const initApp = function() {
      //   firebase.auth().onAuthStateChanged(function(user) {
      //     self.user = user
      //     if (user) {
      //       // User is signed in.
      //       console.log('User is signed in');
      //       var displayName = user.displayName;
      //       var email = user.email;
      //       var emailVerified = user.emailVerified;
      //       var photoURL = user.photoURL;
      //       var uid = user.uid;
      //       var phoneNumber = user.phoneNumber;
      //       var providerData = user.providerData;
      //       user.getIdToken().then(function(accessToken) {
      //         self.user.accessToken = accessToken
      //
      //         document.getElementById('sign-in-status').textContent = 'Signed in';
      //         document.getElementById('sign-in-out').textContent = 'Sign out';
      //         document.getElementById('account-details').textContent = JSON.stringify({
      //           displayName: displayName,
      //           email: email,
      //           emailVerified: emailVerified,
      //           phoneNumber: phoneNumber,
      //           photoURL: photoURL,
      //           uid: uid,
      //           accessToken: accessToken,
      //           providerData: providerData
      //         }, null, '  ');
      //       });
      //     } else {
      //       // User is signed out.
      //       console.log('User is signed out');
      //       document.getElementById('sign-in-status').textContent = 'Signed out';
      //       document.getElementById('sign-in-out').textContent = 'Sign in';
      //       document.getElementById('account-details').textContent = '';
      //     }
      //   }, function(error) {
      //     console.log(error);
      //   });
      // };
      //
      // window.addEventListener('load', function() {
      //   initApp()
      // });






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
      // toggleSignIn: function() {
      //   console.log('Attempting to sign out');
      //   firebase.auth().signOut().then(function() {
      //     // Sign-out successful.
      //     console.log('Sign-out successful')
      //   }).catch(function(error) {
      //     // An error happened.
      //     console.log('An error happened:', error);
      //   });
      // },
      // importFromDrive: function() {
      //   ExplaainAuthor.importFromDrive(self.user)
      // },
      convertFileToCards: function(body) {
        const cards = []
        body.split(/(\r\n\r\n|\n\n|\r\r)/gm).forEach(function(chunk) {
          chunk = chunk.trim()
          if (chunk.length)
            cards.push({text: chunk})
        })
        console.log(cards);
        return cards
      },
      getUser: function() {
        console.log(this.user);
        console.log((this.user && this.user.id) ? this.user : {id: this.userID});
        return (this.user && this.user.id) ? this.user : {id: this.userID}
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
