chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
  if(request.action == "readDom"){
    console.log('reading dom');
    const pageText = document.body.innerText;
    console.log(pageText);
    sendResponse(pageText);
  }
})
