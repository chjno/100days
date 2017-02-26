chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  chrome.tabs.query({}, function (tabs) {
    for (var i=0; i<tabs.length; ++i) {
      chrome.tabs.sendMessage(tabs[i].id, msg.type);
    }
  });
});