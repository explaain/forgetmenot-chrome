import Search from '../mixins/search.js'

const userID = '1455707247850069';
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
  if(request.action == "getPageResults"){
    sendResponse(pageResults);
  }
  if(request.event == "popupOpened"){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {event: 'popupOpened'}, function(response) {});
    });
  }
})
