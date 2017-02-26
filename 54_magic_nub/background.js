var page = chrome.extension.getURL('popup/ps.html');
window.open(page, "ps", "width=300, height=322");

var currentTabId = 0;
chrome.tabs.onActivated.addListener(function (activeInfo){
  // console.log('active tab ' + activeInfo.tabId);
  currentTabId = activeInfo.tabId;

  chrome.tabs.sendMessage(currentTabId, coords);
});

var coords = {type: 'coords'};
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  // console.log(msg);

  if (msg.type == 'coords'){
    coords = msg;
  } else if (msg.type == 'getCoords'){
    chrome.tabs.sendMessage(currentTabId, coords);
  } else if (msg.type == 'openLink'){
    chrome.tabs.update(currentTabId, {url: msg.url})
  } else {
    chrome.tabs.sendMessage(currentTabId, msg);
  }
});
