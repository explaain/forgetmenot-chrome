const getPageText = function() {
  return document.body.innerText;
}
const getUrl = function() {
  return window.location.href;
}
const getBaseUrl = function() {
  return window.location.host.replace('www.','');
}

var pingDiv;

window.onload = function(e){
  console.log(123);
  const pageText = getPageText();
  const url = getUrl();
  const baseUrl = getBaseUrl();
  console.log([pageText]);
  console.log(url);
  chrome.runtime.sendMessage({action: "checkPage", data: {url: url, baseUrl: baseUrl, pageText: pageText}}, function(response) {
    console.log(response);
    const numPings = response.pings.length
    console.log("numPings: ", numPings);
    if (numPings) {
      pingDiv = document.createElement("div")
      pingDiv.style.cssText = ""
        + "position: fixed;"
        + "top: 0;"
        + "right: 0;"
        + "width: 250px;"
        + "margin: 20px;"
        + "padding: 20px 35px;"
        + "font-size: 16px;"
        + "box-shadow: rgba(50, 50, 50, 0.95) 0px 0px 30px;"
        + "border: none;"
        + "border-radius: 10px;"
        + "z-index: 1000000;"
        + "background: white;"
        + "cursor: pointer;"
        + "line-height: 1.4;"
      const text1 = document.createTextNode("👆👆 " + (numPings==1 ? "One memory" : numPings+" memories") + " relevant to this page! 😃");
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
      console.log(pingDiv);
    }
  });
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
  if(request.action == "getPageText"){
    const pageText = getPageText();
    sendResponse(pageText);
  }
  if(request.event == "popupOpened"){
    if (pingDiv) pingDiv.remove();
  }
})
