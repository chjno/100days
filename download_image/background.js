var hist;
var images = [];
function updateHistory(){
  chrome.history.search({text: ''}, function (histArray){
    hist = histArray;
    updateImages();
  });
}

function updateImages(){
  images = [];
  $(hist).each(function (){
    getImages(this.url);
  });
}

function getImages(url){
  $.get(url, function (data){
    $.merge(images, $(data).find('img'));
  });
}

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
  currentTabId = activeInfo.tabId;
});

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function insertImage(){
  var tabId = currentTabId;

  if (tabId !== 0 && tabUrls[tabId].indexOf('http') === 0){
    var image = images[randInt(0, images.length)];
    while (image.src.indexOf('http') !== 0){
      image = images[randInt(0, images.length)];
    }

    chrome.tabs.sendMessage(tabId, image.src);
  }
}

updateHistory();

setInterval(insertImage, 2000);
