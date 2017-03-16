var jquery = chrome.extension.getURL('jquery.js');
var inject = chrome.extension.getURL('inject.js');
var tabUrls = {
  /*
    url: [tabIds]
  */
};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  // console.log(msg);
  if (msg.type == 'loaded'){
    if (!tabUrls.hasOwnProperty(sender.tab.url)){
      spread(sender.tab, msg.add);
    } else {
      var tabIndex = tabUrls[sender.tab.url].indexOf(sender.tab.id);
      chrome.tabs.sendMessage(sender.tab.id, {type: 'scroll', index: tabIndex});
    }
  }
});

function spread(tab, add){
  tabUrls[tab.url] = [tab.id];
  var index = tab.index + 1;
  var parent = tabUrls[tab.url];

  function createCallback(tab){
    parent.push(tab.id);
  }

  for (var i = 0; i < add; i++){
    var params = {
      windowId: tab.windowId,
      index: index + i,
      url: tab.url,
      active: false
    };

    chrome.tabs.create(params, createCallback);
  }
}



chrome.tabs.onRemoved.addListener(function (tabId, removeInfo){
  var closedUrl;
  var index;
  for (var url in tabUrls){
    index = tabUrls[url].indexOf(tabId);
    if (index != -1){
      closedUrl = url;
      break;
    }
  }

  if (closedUrl){
    var toRemove = tabUrls[closedUrl];
    toRemove.splice(index, 1);
    delete tabUrls[closedUrl];
    chrome.tabs.remove(toRemove);
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
  var index;
  for (var url in tabUrls){
    index = tabUrls[url].indexOf(tabId);
    if (index != -1){
      if (url != tab.url){
        var toRemove = tabUrls[url];
        toRemove.splice(index, 1);
        // console.log(toRemove);
        delete tabUrls[url];
        chrome.tabs.remove(toRemove);
      }
      break;
    }
  }

  if (changeInfo.status == 'complete'){
    chrome.tabs.executeScript(tabId, {file: 'jquery.js'}, function (result){
      chrome.tabs.executeScript(tabId, {file: 'inject.js'}, function (result){
        
      });
    });
  }
});

chrome.tabs.onReplaced.addListener(function (tabId, removedId){
  var index;
  for (var url in tabUrls){
    index = tabUrls[url].indexOf(removedId);
    if (index != -1){
      var toRemove = tabUrls[url];
      toRemove.splice(index, 1);
      delete tabUrls[url];
      chrome.tabs.remove(toRemove);
      break;
    }
  }

  chrome.tabs.executeScript(tabId, {file: 'jquery.js'}, function (result){
    chrome.tabs.executeScript(tabId, {file: 'inject.js'}, function (result){
      
    });
  });
});
