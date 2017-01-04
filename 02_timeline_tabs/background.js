console.log('background version 2');

var tabId;
var urls = [];

chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.create({'url': "https://www.facebook.com"}, function (tab){
    tabId = tab.id;
    chrome.tabs.executeScript(tab.id, {file: 'content.js'}, function (){});
  });
});

chrome.runtime.onMessage.addListener(function (links){
  console.log(links);
  console.log(links.length);
  for (var j = 0; j < links.length; j++){
    if (urls.indexOf(links[j]) == -1){
      urls.push(links[j]);
    }
  }

  if (urls.length < 3){
    console.log('not enough links: ' + urls.length);
    chrome.tabs.executeScript(tabId, {file: 'content.js'}, function (){});
  } else {
    console.log('enough links: ' + urls.length);
    chrome.tabs.remove(tabId);
    for (var i = 0; i < urls.length; i++){
      chrome.tabs.create({'url': urls[i]});
    }
  }
});