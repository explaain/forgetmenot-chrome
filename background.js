var Paused = false;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "get_paused")
    sendResponse({paused: Paused});
  }
);

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  Paused = !Paused;
  const iconPath = Paused ? 'icon48-paused.png': 'icon16.png';
  chrome.browserAction.setIcon({
    path: iconPath
  });
});
