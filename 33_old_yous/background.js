// https://archive.org/wayback/available?url=google.com
// https://archive.org/wayback/available?url=google.com&timestamp=2001

var loading = [];
var lookups = {};

lookups = {
  'http://www.google.com': {
    snapshot: 'http://web.archive.org/aewfawfe',
    timestamp: 20060102
  },
  'http://chino.kim': {
    snapshot: 'http://web.akfsdf',
    timestamp: 20150510
  }
}

chrome.webNavigation.onTabReplaced.addListener(function (details){
  getTabUrl(details.tabId);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

  if (changeInfo.status == 'loading'){
    if (loading.indexOf(tabId) == -1){
      loading.push(tabId);
      getTabUrl(tabId);
    }

  } else if (changeInfo.status == 'complete'){

    var loadingIndex = loading.indexOf(tabId);
    if (loadingIndex !== -1){
      loading.splice(loadingIndex, 1);
    }

    if (tab.url.indexOf('//web.archive.org') == -1 && tab.url.indexOf('http') === 0 && lookups.hasOwnProperty(tab.url)){
      if (lookups[tab.url].snapshot !== null){
        chrome.tabs.executeScript(tabId, {code:"document.body.innerHTML = 'loading...'"});
      }
    }
  }
});

function getTabUrl(tabId){
  chrome.tabs.get(tabId, function (tab){

    if (lookups.hasOwnProperty(tab.url)){
      if (lookups[tab.url].snapshot !== null){
        chrome.tabs.executeScript(tabId, {code:"document.body.innerHTML = 'loading...'"});
        randomSnapshot(tabId, tab.url, lookups[tab.url].timestamp);
      }
    } else {

      if (tab.url.indexOf('//web.archive.org') == -1 && tab.url.indexOf('http') === 0){
        chrome.tabs.executeScript(tabId, {code:"document.body.innerHTML = 'loading...'"});
        getOldestSnapshot(tabId, tab.url, 1996);
      }
    }
  });
}

function getOldestSnapshot(tabId, originalUrl, year){
  console.log('searching ' + year);
  var site = originalUrl.replace(/.*?:\/\//g, "");
  var url = 'https://archive.org/wayback/available?url=' + site + '&timestamp=' + year;

  $.getJSON(url, function (data, status, huh){
    lookups[originalUrl] = {};

    if (data.archived_snapshots.closest){
      var target = data.archived_snapshots.closest.url.split('/http').join('id_/http');
      var timestamp = data.archived_snapshots.closest.timestamp.slice(0,8).toString();
      lookups[originalUrl].snapshot = target;
      lookups[originalUrl].timestamp = timestamp;

      // chrome.tabs.update(tabId, {url: target});
      randomSnapshot(tabId, originalUrl, timestamp);
    } else {
      lookups[originalUrl].snapshot = null;
      chrome.tabs.update(tabId, {url: originalUrl});
    }
  });
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomSnapshot(tabId, page, ts){
  console.log('getting random snapshot after ' + ts);
  var site = page.replace(/.*?:\/\//g, "");

  var year = ts.slice(0,4);
  var month = ts.slice(4,6);
  var date = ts.slice(6,8);

  var dateObj = randomDate(new Date(year, month, date), new Date());

  var newYear = dateObj.getFullYear().toString();
  var newMonth = (dateObj.getMonth() + 1).toString();
  if (newMonth.length < 2){
    newMonth = '0' + newMonth;
  }
  var newDate = dateObj.getDate().toString();
  if (newDate.length < 2){
    newDate = '0' + newDate;
  }

  var newTS = newYear + newMonth + newDate;
  var url = 'https://archive.org/wayback/available?url=' + site + '&timestamp=' + newTS;

  $.getJSON(url, function (data, status, huh){
    console.log(data);
    if (data.archived_snapshots.closest){
      var target = data.archived_snapshots.closest.url.split('/http').join('id_/http');
      chrome.tabs.update(tabId, {url: target});
    } else {
      console.log('snapshot error');
      console.log(data);
    }
  });
}
