chrome.idle.setDetectionInterval(15);
chrome.idle.onStateChanged.addListener(function (idleState){
  if (idleState == 'active'){
    chrome.tabs.sendMessage(currentTabId, false);
  } else {
    chrome.tabs.sendMessage(currentTabId, true);
  }
});

var currentTabId = 0;
chrome.tabs.onActivated.addListener(function (activeInfo){
  currentTabId = activeInfo.tabId;
});
