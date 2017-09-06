import Vue from 'vue';

import ExplaainSearch from '../plugins/explaain-search.js';


const userIDs = {
  live: {
    Jeremy: '1627888800569309',
    Matt: '1455707247850069',
    Carol: '1459068990878077',
    Harriet: '1478776232161468',
    Jonny: '1513554438729753',
  },
  staging: {
    Jeremy: '1366746370089527',
    Matt: '1528134990563202',
  },
  local: {
    Jeremy: '1300120880110773',
    Matt: '1428419100528438',
  }
}

const userID = userIDs.local.Jeremy;
var pageResults = {};

const algoliaParams = { // Need to send these to app.vue to avoid duplication!
  appID: 'I2VKMNNAXI',
  apiKey: '2b8406f84cd4cc507da173032c46ee7b',
  index: 'ForgetMeNot_Context'
}
Vue.use(ExplaainSearch, algoliaParams)

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.action == "checkPage") {
      console.log(request.data);
      ExplaainSearch.getPageResults(userID, request.data)
      .then(function(results) {
        console.log(results);
        pageResults = results;
        sendResponse(results);
      })
      return true;
    }
  });



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if(request.action == "getUser"){
    sendResponse(userID);
  }
  if(request.action == "getPageResults"){
    sendResponse(pageResults);
  }
  if(request.event == "popupOpened"){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {event: 'popupOpened'}, function(response) {});
    });
  }
})
