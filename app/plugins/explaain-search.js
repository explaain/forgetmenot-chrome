import Q from 'q';
import Algolia from 'algoliasearch';

const Search = {
  install(Vue, options) {
    console.log(options);
    const AlgoliaClient = Algolia(options.appID, options.apiKey);
    const AlgoliaIndex = AlgoliaClient.initIndex(options.index);

    const advancedSearch = function(params) {
      const d = Q.defer()
      AlgoliaIndex.search(params, function(err, content) {
        if (err) {
          console.log(err);
          d.reject(err)
        } else {
          d.resolve(content.hits)
        }
      });
      return d.promise
    }

    const searchCards = function(userID, searchText, hitsPerPage) {
      const d = Q.defer()
      const params = {
        query: searchText,
        filters: userID.length ? 'userID: ' + userID : '',
        hitsPerPage: hitsPerPage || null
      };
      console.log(params);
      this.advancedSearch(params)
      .then(function(hits) {
        console.log(hits);
        d.resolve(hits)
      }).catch(function(e) {
        d.reject(e);
      })
      return d.promise
    }

    const compoundSearch = function(userID, searchText) {
      const d = Q.defer()
      const self = this;
      const maxLength = 400;
      const searchTextArray = [];
      const hitsPerPage = Math.min(Math.max(Math.ceil(10 / (searchText.length / maxLength)), 3), 12);
      for (var i = 0; i < searchText.length; i += maxLength) {
        searchTextArray.push(searchText.substring(i, i+maxLength))
      }
      const promises = searchTextArray.map(function(t, j) {
        return self.searchCards(userID, t, hitsPerPage);
      });
      Q.allSettled(promises)
      // promises[0]
      .then(function(results) {
        var results = [].concat.apply([], results.map(function(r) {return r.value}));
        results = self.removeDuplicates(results, 'objectID')
        console.log(results);
        d.resolve(results)
      })
      .catch(function(e) {
        console.log(e);
      });
      return d.promise
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

    const checkPageHit = function(pageData, results) {
      //Not yet accounting for capitals
      const boringWords = [
        'favourite',
        'world',
        'name',
        'this',
        'need',
        'best',
        'like',
        'the',
        'are',
        'is',
        'my',
        'my',
      ]
      const hits = [];
      results.forEach(function(result, i) {
        var count = [];
        result.context.forEach(function(c) {
          if (pageData.pageText.indexOf(c.value) > -1
          && hits.indexOf(result.objectID) == -1
          && c.value.length > 3
          && boringWords.indexOf(c.value) == -1
          && count.indexOf(c.value) == -1) {
            console.log(c.value);
            count.push(c.value);
          }
        })
        if (count.length > 1) {
          console.log(result.sentence);
          hits.push(result)
        }
      })

      //Force no hits
      return [];
    }

    const checkPageReminder = function(userID, pageData) {
      const d = Q.defer()
      const params = {
        query: '',
        filters: 'userID: ' + userID + ' AND triggerUrl: ' + pageData.baseUrl
      };
      console.log(params);
      this.advancedSearch(params)
      .then(function(reminders) {
        d.resolve(reminders)
      }).catch(function(e) {
        d.reject(e)
      })
      return d.promise
    }

    const getPageResults = function(userID, pageData) {
      const d = Q.defer()
      // Gets all results
      const self = this;
      const pageResults = {};
      console.log(userID, pageData);
      self.compoundSearch(userID, pageData.pageText)
      .then(function(results) {
        console.log(1);
        console.log(results);
        pageResults.memories = results;
        // Checks whether a ping is required
        pageResults.hits = self.checkPageHit(pageData, results);
        console.log(2);
        console.log(pageResults.hits);
        return self.checkPageReminder(userID, pageData)
      }).then(function(reminders) {
        pageResults.reminders = reminders;
        console.log(3);
        console.log(pageResults.reminders);
        // Returns results plus ping
        pageResults.pings = pageResults.reminders.concat(pageResults.hits)
        pageResults.pings.forEach(function(ping) {
          console.log(ping.objectID);
          ping.highlight = true;
        })
        pageResults.memories = pageResults.pings.concat(pageResults.memories)
        pageResults.memories = self.removeDuplicates(pageResults.memories, 'objectID')
        console.log(pageResults);
        d.resolve(pageResults)
      }).catch(function(e) {
        console.log(e);
        d.reject(e)
      })
      return d.promise
    }

    this.advancedSearch = advancedSearch;
    this.searchCards = searchCards;
    this.compoundSearch = compoundSearch;
    this.getPageResults = getPageResults;
  }

}

export default Search;
