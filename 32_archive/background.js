// https://archive.org/wayback/available?url=google.com
// https://archive.org/wayback/available?url=google.com&timestamp=2001

var loading = [];
var lookups = {};

chrome.webNavigation.onTabReplaced.addListener(function (details){
  var tabId = details.tabId;

  chrome.tabs.get(tabId, function (tab){
    if (tab.url.indexOf('//web.archive.org') == -1 && tab.url.indexOf('http') === 0 && !lookups.hasOwnProperty(tab.url)){
      chrome.tabs.executeScript(tabId, {code:"document.body.innerHTML = 'loading...'"});
    }
    if (lookups.hasOwnProperty(tab.url)){
      if (lookups[tab.url] !== null){
        console.log('opening from lookups');
        chrome.tabs.update(tabId, {url: lookups[tab.url]});
      }
    } else {

      if (tab.url.indexOf('//web.archive.org') == -1 && tab.url.indexOf('http') === 0){
        searchOld(tabId, tab.url, 1996);
      }

    }
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

  if (changeInfo.status == 'loading'){
    if (loading.indexOf(tabId) == -1){
      loading.push(tabId);
      chrome.tabs.get(tabId, function (tab){

        if (lookups.hasOwnProperty(tab.url)){
          if (lookups[tab.url] !== null){
            console.log('opening from lookups');
            chrome.tabs.update(tabId, {url: lookups[tab.url]});
          }
        } else {
          if (tab.url.indexOf('//web.archive.org') == -1 && tab.url.indexOf('http') === 0){
            chrome.tabs.executeScript(tabId, {code:"window.stop()"});
            searchOld(tabId, tab.url, 1996);
          }

        }
      });
    }
  } else if (changeInfo.status == 'complete'){

    var loadingIndex = loading.indexOf(tabId);
    if (loadingIndex !== -1){
      loading.splice(loadingIndex, 1);
    }
    if (tab.url.indexOf('//web.archive.org') == -1 && tab.url.indexOf('http') === 0 && lookups[tab.url] !== null){

      chrome.tabs.executeScript(tabId, {code:"document.body.innerHTML = 'loading...'"});
    }
  }
});


function searchOld(tabId, link, year){
  console.log('searching ' + year);
  var site = link.replace(/.*?:\/\//g, "");
  var url = 'https://archive.org/wayback/available?url=' + site + '&timestamp=' + year;

  $.getJSON(url, function (data, status, huh){
    if (data.archived_snapshots.closest){
      var target = data.archived_snapshots.closest.url.split('/http').join('id_/http');
      lookups[link] = target;

      chrome.tabs.update(tabId, {url: target});
    } else {
      // if (year >= new Date().getFullYear()){
        lookups[link] = null;
        chrome.tabs.update(tabId, {url: link});
      // } else {
      //   year++;
      //   searchOld(tabId, link, year);
      // }
    }
  });
}
