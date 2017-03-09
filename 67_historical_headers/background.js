var headers = {};

/*
  var headers = {
    tabId:{
      urls: [url1, url2],
      imgs: [image1, image2]
    }
  };
*/

function screenshot(tabId, url){
  chrome.tabs.sendMessage(tabId, {type: 'hide'});
  console.log('taking screenshot');

  // if (url.indexOf('http') == 0){
    chrome.tabs.captureVisibleTab(function (dataUrl) {
      chrome.tabs.sendMessage(tabId, {type: 'unhide'});
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
        chrome.tabs.sendMessage(tabId, {type: 'scroll'});
        return;
      }

      if (!headers.hasOwnProperty(tabId)){
        headers[tabId] = {
          urls: [],
          imgs: []
        };
      }

      var urlIndex = headers[tabId].urls.indexOf(url);

      if (urlIndex == -1){
        headers[tabId].urls.push(url);
        headers[tabId].imgs.push(dataUrl);
      } else {
        headers[tabId].imgs[urlIndex] = dataUrl;
      }
    });
  // }

}

chrome.webNavigation.onTabReplaced.addListener(function (details){
  console.log('onTabReplaced');

  var copy = headers[details.replacedTabId];
  headers[details.tabId] = copy;
  // delete headers[details.replacedTabId];

  chrome.tabs.sendMessage(details.tabId, {type: 'headers', headers: headers[details.tabId]});
  chrome.tabs.query({active: true, currentWindow: true}, function (tabArr){
    console.log(tabArr);
    var tab = tabArr[0]
    screenshot(tab.id, tab.url);
  });
});

chrome.tabs.onActivated.addListener(function (activeInfo){
  console.log('onActivated');

  chrome.tabs.get(activeInfo.tabId, function (tab){
    setTimeout(function (){
      screenshot(tab.id, tab.url);
    }, 100);
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
  if (changeInfo.status == 'complete'){
    console.log('on load complete');
    chrome.tabs.sendMessage(tabId, {type: 'headers', headers: headers[tabId]});
    if (tab.active){
      console.log('active tab load complete');
      screenshot(tabId, tab.url);
    }
  }
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  console.log(msg);

  if (msg.type == 'update'){
    screenshot(sender.tab.id, msg.url);
  }
});