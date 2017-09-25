import log from 'loglevel';
log.setLevel('debug')

const getPageText = function() {
  return document.body.innerText;
}
const getUrl = function() {
  return window.location.href;
}
const getBaseUrl = function() {
  return window.location.host.replace('www.','');
}
const collectPageData = function() {
  const pageText = getPageText();
  const url = getUrl();
  const baseUrl = getBaseUrl();
  return {url: url, baseUrl: baseUrl, pageText: pageText}
}


var pingDiv;

// document.addEventListener("DOMContentLoaded", function(){ sendPageText(); }, false);

window.onload = function(e){
  sendPageText()
}

const sendPageText = function() {
  log.trace(sendPageText);
  const pageText = getPageText();
  const url = getUrl();
  const baseUrl = getBaseUrl();
  log.trace([pageText]);
  log.debug(url);
  chrome.runtime.sendMessage({action: "checkPage", data: {url: url, baseUrl: baseUrl, pageText: pageText}}, function(response) {
    log.debug(response);
    const numPings = response.pings.length
    log.debug("numPings: ", numPings);
    if (numPings) {
      const existingPings = document.getElementsByClassName('forget-me-not-ping');
      while(existingPings.length > 0){
        log.trace('Deleting existing ping');
        existingPings[0].parentNode.removeChild(existingPings[0]);
      }
      if (pingDiv) pingDiv.remove();
      pingDiv = document.createElement("div")
      pingDiv.style.cssText = ""
        + "position: fixed;"
        + "top: 0;"
        + "right: 0;"
        + "width: 300px;"
        + "margin: 20px;"
        + "padding: 20px 35px;"
        + "font-size: 16px;"
        + "font-weight: normal;"
        + "color: #333;"
        + "box-shadow: rgba(50, 50, 50, 0.95) 0px 0px 30px;"
        + "border: none;"
        + "border-radius: 10px;"
        + "z-index: 1000000;"
        + "background: white;"
        + "cursor: pointer;"
        + "line-height: 1.4;"
        + "font-family: Arial, sans-serif;"
      var pageFloat = document.createElement("div");
      pageFloat.style.cssText = ""
      + "float: right;"
      pageFloat.innerHTML = "👆👆";
      pingDiv.appendChild(pageFloat)
      const text1 = document.createTextNode((numPings==1 ? "One memory" : numPings+" memories") + " relevant to this page! 😃");
      text1.className = 'forget-me-not-ping'
      pingDiv.appendChild(text1)
      var pageSpan = document.createElement("span");
      pageSpan.style.cssText = ""
        + "color: grey;"
        + "font-style: italic;"
        + "margin-left: 5px;"
      pageSpan.innerHTML = "Click to dismiss";
      pingDiv.appendChild(pageSpan)
      pingDiv.onclick = function(){
        pingDiv.remove();
      };
      document.body.appendChild(pingDiv);
      log.trace(pingDiv);
    }
  });
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
  log.trace('Request received');
  if(request.action == "getPageData"){
    log.debug('1')
    log.trace('Received getPageData request');
    const pageData = collectPageData()
    log.debug(pageData)
    sendResponse(pageData)
  }
  if(request.event == "popupOpened"){
    log.trace('Received popupOpened event');
    if (pingDiv) pingDiv.remove();
  }
})

sendPageText();
