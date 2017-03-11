function screenshot(tabId){
  chrome.tabs.captureVisibleTab(function (dataUrl) {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message);
      chrome.tabs.sendMessage(tabId, {type: 'scroll'});
      return;
    }

    chrome.tabs.sendMessage(tabId, {type: 'img', url: dataUrl});
  });
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  if (msg.type == 'screenshot'){
    screenshot(sender.tab.id);
    if (sender.tab.active){
      chrome.tabs.sendMessage(tabId, {type: 'playing', state: true});
    } else {
      chrome.tabs.sendMessage(tabId, {type: 'playing', state: false});
      
    }
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo){
  tabId = activeInfo.tabId;
  chrome.tabs.query({}, function (tabs) {
    for (var i = 0; i < tabs.length; ++i) {
      if (tabs[i].active){
        chrome.tabs.sendMessage(tabs[i].id, {type: 'playing', state: true});
      } else {
        chrome.tabs.sendMessage(tabs[i].id, {type: 'playing', state: false});
      }
    }
  });
});