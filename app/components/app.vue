<template lang="html">
  <div class="app">
    <explorer :userID="userID" :logo="logo">
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
