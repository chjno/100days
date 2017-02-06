var getTextNodes = function(el) {
  return $(el).find(":not(iframe)").addBack().contents().filter(function() {
    return this.nodeType == 3;
  });
};

function textNodesUnder(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var hist;
function updateHistory(){
  chrome.history.search({text: ''}, function (histArray){
    hist = histArray;
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
updateHistory();

/*
  update current tab id on focus changed
*/
var currentTabId = 0;
chrome.tabs.onActivated.addListener(function (activeInfo){
  currentTabId = activeInfo.tabId;
});

function insertFlashback(){
  var tabId = currentTabId;

  if (tabId !== 0){
    if (tabUrls[tabId].indexOf('http') === 0){
      var url = hist[randInt(0, hist.length)].url;
      while (url == tabUrls[tabId] && url.indexOf('http') !== 0){
        url = hist[randInt(0, hist.length)].url;
      }

      $.get(url, function (data){
        var virginElts = $(data).find("body, :not(:has(*))");
        var textNodes = getTextNodes(virginElts);
        var index = randInt(0, textNodes.length);
        while (!(/\S/.test($(textNodes[index]).text().replace(/\r?\n|\r/g, '')) && $(textNodes[index]).text().indexOf('{') == -1 && $(textNodes[index]).text().indexOf(';') == -1)){
          textNodes.splice(index, 1);
          if (textNodes.length === 0){
            break;
          }
          index = randInt(0, textNodes.length);
        }

        chrome.tabs.sendMessage(tabId, $(textNodes[index]).text());
      });
    }
  }
}

setInterval(insertFlashback, 500);
