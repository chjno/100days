var attachedTabs = [];

function attachAll(){
  chrome.tabs.query({}, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      attachDebugger(tabs[i].id);
    }
  });
}
attachAll();

chrome.webNavigation.onTabReplaced.addListener(function (details){
  var tabId = details.tabId;
  if (attachedTabs.indexOf(tabId) == -1){
    attachDebugger(tabId);
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (attachedTabs.indexOf(tabId) == -1){
    attachDebugger(tabId);
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    return {cancel: overCap};
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);

chrome.tabs.onActivated.addListener(function (activeInfo){
  var tabId = activeInfo.tabId;
  if (attachedTabs.indexOf(tabId) == -1){
    attachDebugger(tabId);
  }
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo){
  chrome.debugger.detach({ tabId: tabId });
});

var data = 0;
var cap = 100000000;
// var cap = 2000000000;
var overCap = false;
chrome.debugger.onEvent.addListener(function (source, method, params){
  if (method == 'Network.dataReceived'){
    data += params.encodedDataLength;
    if (data > cap){
      overCap = true;
      console.log('over cap');
    } else {
      console.log(data);
    }
  }
});

var protocolVersion = '1.0';
function attachDebugger(tabId){
  if (!overCap){
    chrome.debugger.attach({
      tabId: tabId
    }, protocolVersion, function (){
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
        return;
      }

      attachedTabs.push(tabId);

      chrome.debugger.sendCommand({
        tabId: tabId
      }, "Network.enable", {}, function (response){});

      chrome.debugger.sendCommand({
        tabId: tabId
      }, "Network.setCacheDisabled", {cacheDisabled: true}, function (response){});
    });
  }
}

// var lastMonth = (new Date()).getMonth();
var today = (new Date()).getDate();
function checkTime(){
  // var month = (new Date()).getMonth();
  // if (month != lastMonth){
  //   lastMonth = month;
  //   data = 0;
  //   overCap = false;
  //   // attachAll();
  // }
  var date = (new Date()).getDate();
  if (date != today){
    today = date;
    data = 0;
    overCap = false;
    // attachAll();
  }
}
setInterval(checkTime, 60000);
