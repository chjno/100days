var currentTabId = 0;

function getCurrentTab(){
  chrome.tabs.query({currentWindow: true, active : true}, function (tabArr){
    // console.log('current tab ' + tabArr[0].id);
    currentTabId = tabArr[0].id;
    tellTab();
  });
}

chrome.tabs.onActivated.addListener(function (activeInfo){
  // console.log('tab changed ' + activeInfo.tabId);
  currentTabId = activeInfo.tabId;
  tellTab();
});

chrome.windows.onFocusChanged.addListener(function (windowId){
  // console.log('window changed ' + windowId);
  getCurrentTab();
});

function tellTab(){
  chrome.windows.getAll({populate:true}, function (wins){
    wins.forEach(function (win){
      win.tabs.forEach(function (tab){
        if (tab.id == currentTabId){
          chrome.tabs.sendMessage(currentTabId, true);
        } else {
          chrome.tabs.sendMessage(tab.id, false);
        }
      });
    });
  });
}

chrome.runtime.onMessage.addListener(function (msg,sender,sendResponse){
  tellTab();
});
