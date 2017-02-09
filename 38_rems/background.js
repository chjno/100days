var hist;
var images = [];
function updateHistory(){
  chrome.history.search({text: ''}, function (histArray){
    hist = histArray;
  });
}

updateHistory();

var tabUrls = {};
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
  tabUrls[tabId] = tab.url;
  updateHistory();
});

chrome.webNavigation.onTabReplaced.addListener(function (details){
  chrome.tabs.get(details.tabId, function (tab){
    tabUrls[tab.id] = tab.url;
  });
  updateHistory();
});

/*
  on launch, get all current tabs & URLs
*/
chrome.windows.getAll({populate:true}, function (windows){
  windows.forEach(function (window){
    window.tabs.forEach(function (tab){
      tabUrls[tab.id] = tab.url;
    });
  });
});

/*
  update current tab id on focus changed
*/
var currentTabId = 0;
chrome.tabs.onActivated.addListener(function (activeInfo){
  if (browsing){
    chrome.tabs.sendMessage(currentTabId, false);
    currentTabId = activeInfo.tabId;
    chrome.tabs.sendMessage(currentTabId, true);
  } else {
    currentTabId = activeInfo.tabId;
  }
});

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// chrome.idle.setDetectionInterval(30);
chrome.idle.onStateChanged.addListener(function (idleState){
  // if (idleState !== 'active'){
  if (idleState == 'locked'){
    chrome.tabs.sendMessage(currentTabId, true);
    browsing = true;
    browse();
    highlight();
  // } else {
  } else if (idleState == 'active'){
    chrome.windows.getAll({populate:true}, function (windows){
      windows.forEach(function (window){
        window.tabs.forEach(function (tab){
          chrome.tabs.sendMessage(tab.id, false);
        });
      });
    });
    browsing = false;
    clearTimeout(browseTimeout);
    clearTimeout(highlightTimeout);
  }

  // console.log(idleState);
});

var browsing = false;
var browseTimeout;
function browse(){
  var url = hist[randInt(0, hist.length)].url;
  // console.log(url);
  chrome.tabs.update(currentTabId, {url: url});
  browseTimeout = setTimeout(browse, randInt(30000, 180000));
}

var highlightTimeout;
function highlight(){
  var wins = [];
  chrome.windows.getAll({populate:true}, function (windows){
    windows.forEach(function (window){
      wins.push(window);
    });

    function update(){
      chrome.tabs.sendMessage(currentTabId, false);
      var win = wins[randInt(0, wins.length)];
      chrome.windows.update(win.id, {focused: true, state: 'maximized'}, function (){
        var tab = win.tabs[randInt(0, win.tabs.length)];
        chrome.tabs.update(tab.id, {active: true}, function (tab){
          currentTabId = tab.id;
          chrome.tabs.sendMessage(currentTabId, true);
        });
      });
    }

    update();
    highlightTimeout = setTimeout(highlight, randInt(5000, 20000));
  });
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  if (browsing && msg){
    chrome.tabs.sendMessage(currentTabId, true);
  }
});
