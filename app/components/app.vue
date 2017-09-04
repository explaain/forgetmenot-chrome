<template lang="html">
  <div class="app">
    <explorer :userID="userID" :logo="logo" :algoliaParams="algoliaParams" :authorParams="authorParams">
      <ibutton slot="buttons" icon="search-plus" text="Page" :click="fromPage" v-if="plugin"></ibutton>
    </explorer>
  </div>
</template>

<script>

  import Vue from 'vue';
  import Explorer from './explorer.vue';
  import IconButton from './ibutton.vue';

  import Q from 'q';

  export default {
    data(){
      return {
        algoliaParams: {
          appID: 'I2VKMNNAXI',
          apiKey: '2b8406f84cd4cc507da173032c46ee7b',
          index: 'ForgetMeNot_Context'
        },
        authorParams: {
          url: 'http://forget-me-not--app.herokuapp.com/api/memories'
        },
        userID: '',
        plugin: true,
        logo: "../images/logo.png",
        pageCards: [], //???
        cards: [], //???
      }
    },
    created: function() {
      this.getUser();
      if (this.plugin) {
        this.fromPage()
      }
    },
    components:{
      explorer: Explorer,
      ibutton: IconButton
    },
    methods: {
      getUser: function() {
        const self = this;
        try {
          chrome.runtime.sendMessage({action: "getUser"}, function(userID) {
            console.log('userID', userID);
            self.userID = userID;
          });
        } catch(e) {
          this.plugin = false;
          self.userID = '1627888800569309';
        }
      },
      fromPage: function() {
        console.log('fromPage');
        const self = this;
        if (self.pageCards.length) {
          console.log(self.pageCards);
          console.log(1);
          self.updateCards(self.pageCards, "No cards found from page")
        } else {
          chrome.runtime.sendMessage({action: "getPageResults", event: "popupOpened"}, function(pageResults) {
            console.log(2);
            // console.log(pageResults);
            // self.pageResults = pageResults;
            if (pageResults.memories) {
              self.pageCards = pageResults.memories;
              console.log(self.pageCards);
              self.updateCards(self.pageCards, "No cards found from page")
            }
          });
        }
      },
      updateCards: function(cards, noCardMessage) {
        console.log(cards);
        const data = {
          cards: cards,
          noCardMessage: noCardMessage
        }
        this.$emit('updateCards1', data);

      },
      // pageResults: function() {
      //   const d = Q.defer()
      //   if (this.plugin) {
      //     chrome.runtime.sendMessage({action: "getPageResults"},
      //     function(pageResults) {
      //       self.pageCards
      //       d.resolve(text)
      //     });
      //     // chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
      //     // });
      //   } else {
      //     d.resolve("Newspeak")
      //   }
      //   return d.promise
      // },
    }
  }
</script>

<style lang="css">

  body > div.app {
    margin: auto;
    width:450px;
    min-height:800px;
  }

</style>
