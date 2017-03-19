var windowRemoved = false;
var tabUrls = {
  // windowId: {
  //   tabId: {
  //     index:
  //     url:
  //   }
  // }
};

function updateTabUrls(){
  if (!windowRemoved){
    chrome.tabs.query({}, function (tabArr){
      tabUrls = {};
      for (var tab of tabArr){
        if (!tabUrls[tab.windowId]){
          tabUrls[tab.windowId] = {};
        }
        tabUrls[tab.windowId][tab.id] = {
          index: tab.index,
          url: tab.url
        };
      }
      console.log(tabUrls);
    });
  }
}

function doubleTabs(windowId, tabId){
  var params = {
    windowId: windowId,
    index: tabUrls[windowId][tabId].index,
    active: true,
    url: tabUrls[windowId][tabId].url
  };

  chrome.tabs.create(params);
  params.index++;
  chrome.tabs.create(params, function (tab){
    updateTabUrls();
  });

}

function doubleWindows(windowId){
  var urls = [];
  for (var tabId in tabUrls[windowId]){
    if (tabUrls[windowId].hasOwnProperty(tabId)) {
      var url = tabUrls[windowId][tabId].url;
      urls.push(url);
    }
  }

  windowRemoved = false;
  chrome.windows.create({url: urls, focused: true});
  chrome.windows.create({url: urls, focused: true});

}

chrome.windows.onCreated.addListener(function (window){
  updateTabUrls();
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
  if (tab.url != tabUrls[tab.windowId][tabId]){
    updateTabUrls();
  }
});

chrome.tabs.onReplaced.addListener(function (tabId, removedId){
  updateTabUrls();
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo){
  var windowId = removeInfo.windowId;
  if (!removeInfo.isWindowClosing){
    doubleTabs(windowId, tabId);
  }
});

chrome.windows.onRemoved.addListener(function (windowId){
  windowRemoved = true;
  doubleWindows(windowId);
});

updateTabUrls();