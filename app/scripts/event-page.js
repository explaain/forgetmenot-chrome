import Search from '../mixins/search.js'

const userIDs = {
  live: {
    Jeremy: '1627888800569309',
    Matt: '1455707247850069',
    Carol: '1459068990878077',
    Harriet: '1478776232161468',
    Jonny: '1513554438729753',
  },
  staging: {
    Jeremy: '',
    Matt: '',
  },
  local: {
    Jeremy: '',
    Matt: '',
  }
}

const userID = userIDs.live.Jeremy;
var pageResults = {};


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.action == "checkPage") {
      console.log(request.data);
      Search.methods.getPageResults(userID, request.data)
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
