const AlgoliaClient = algoliasearch('I2VKMNNAXI', '2b8406f84cd4cc507da173032c46ee7b');
const AlgoliaIndex = AlgoliaClient.initIndex('ForgetMeNot_Context');

var app = new Vue({
  el: '#app',
  data: {
    plugin: false,
    pageCards: [],
    cards: [],
    query: '',
  },
  methods: {
    search: function() {
      const self = this;
      searchCards(app.query, 12)
      .then(function(hits) {
        console.log('hits');
        self.cards = hits
      }).catch(function(err) {
        console.log(err);
      })
    },
    fromPage: function() {
      if (this.pageCards.length) {
        this.cards = this.pageCards;
      } else {
        getPageText()
        .then(function(text) {
          searchAll(text)
        })
      }
    },
    searchRecent: function() {
      const self = this;
      searchCards("", 24)
      .then(function(hits) {
        console.log('hits');
        self.cards = hits
      }).catch(function(err) {
        console.log(err);
      })
    },
    create: function() {

    },
    copytoClipboard: function(element) {
      console.log(element);
      console.log(element.target);
      console.log(this.$el);
      console.log($(this));
      element.target.select();
      document.execCommand('copy');
    }
  }
})

Vue.component('card', {
  props: ['card'],
  template: '<div class="card"><p>{{card.sentence}}</p><img v-if="card.attachments && card.attachments[0]" v-bind:src="card.attachments[0].url"></div>'
})










const createCard = function(text) {
  // const d = Q.defer()
  // console.log(searchText);
  // AlgoliaIndex.addObject({
  //   firstname: 'Jimmie',
  //   lastname: 'Barninger'
  // }, 'myID', function(err, content) {
  //   console.log('objectID=' + content.objectID);
  // });
  // AlgoliaIndex.search(searchText, {
  //   hitsPerPage: hitsPerPage
  // }, function(err, content) {
  //   if (err) {
  //     console.log(err);
  //     d.reject(err)
  //   } else {
  //     d.resolve(content.hits)
  //   }
  // });
  // return d.promise
}

const searchCards = function(searchText, hitsPerPage) {
  const d = Q.defer()
  console.log(searchText);
  AlgoliaIndex.search(searchText, {
    hitsPerPage: hitsPerPage
  }, function(err, content) {
    if (err) {
      console.log(err);
      d.reject(err)
    } else {
      d.resolve(content.hits)
    }
  });
  return d.promise
}

/* For Browser Plugin Only */
const getPageText = function() {
  const d = Q.defer()
  d.resolve("My favourite book")
  // chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
  //   chrome.tabs.sendMessage(tabs[0].id, {action: "readDom"}, searchAll);
  // });
  return d.promise
}
const searchAll = function(searchText) {
  console.log(searchText);
  const maxLength = 400;
  const searchTextArray = [];
  const hitsPerPage = Math.min(Math.max(Math.ceil(10 / (searchText.length / maxLength)), 3), 12);
  for (var i = 0; i < searchText.length; i += maxLength) {
    searchTextArray.push(searchText.substring(i, i+maxLength))
  }
  console.log(searchTextArray);
  const promises = searchTextArray.map(function(t, j) {
    console.log(j);
    return searchCards(t, hitsPerPage);
  });
  Q.allSettled(promises)
  .then(function(results) {
    var results = [].concat.apply([], results.map(function(r) {return r.value}));
    var results = removeDuplicates(results, 'objectID')
    app.pageCards = results;
    app.cards = results;
		d.resolve(results)
	});
}
const removeDuplicates = function(originalArray, objKey) {
  var trimmedArray = [], values = [], value;
  for(var i = 0; i < originalArray.length; i++) {
    value = originalArray[i][objKey];
    if(values.indexOf(value) === -1) {
      trimmedArray.push(originalArray[i]);
      values.push(value);
    }
  }
  return trimmedArray;
}
/* End Browser Plugin */

window.onload = function() {
  if (app.plugin) {
    app.fromPage();
  }
};
