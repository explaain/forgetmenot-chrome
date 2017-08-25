chrome.runtime.sendMessage({message: "get_paused"}, function(response) {
  console.log(response);
  Paused = response.paused;
  console.log('Paused: ', response.paused);

  if (Paused) {
    console.log('Extension Paused')
  } else {
    console.log('Extension Running')
    var s = document.createElement('script');
    s.src = chrome.extension.getURL('pageScript.js');
    (document.body || document.documentElement).appendChild(s);
  }
});


// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if( request.message === "paused_value" ) {
//       Paused = request.paused;
//     }
//   }
// );





chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
  if(request.action == "readDom"){
    console.log('reading dom');
    const pageText = document.body.innerText;
    console.log(pageText);
    sendResponse(pageText);
  }
})
