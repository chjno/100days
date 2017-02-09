chrome.idle.setDetectionInterval(15);
chrome.idle.onStateChanged.addListener(function (idleState){
  // console.log(idleState);
  if (idleState == 'active'){
    console.log('false');
    chrome.tabs.sendMessage(currentTabId, false);
  } else {
    console.log('true');
    chrome.tabs.sendMessage(currentTabId, true);
  }
});

var currentTabId = 0;
chrome.tabs.onActivated.addListener(function (activeInfo){
  currentTabId = activeInfo.tabId;
  console.log(currentTabId);
});
