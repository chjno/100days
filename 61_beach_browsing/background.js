chrome.tabs.onActivated.addListener(function (activeInfo){
  var tabId = activeInfo.tabId;

  chrome.tabs.query({}, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      chrome.tabs.sendMessage(tabs[i].id, false);
    }
    chrome.tabs.sendMessage(tabId, true);
  });
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  if (msg.type == 'load'){
    if (sender.tab.active){
      sendResponse(true);
    }
  }
});