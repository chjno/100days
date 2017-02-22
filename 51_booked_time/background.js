function checkIn(){
  chrome.tabs.query({active: true, currentWindow: true}, function (tabArray){
    updatePages();
    restartTimer(tabArray[0]);
  });
  updateBookmarks();
}

function updateBookmarks(){
  var sortedPages = sortPages();
  // console.log(sortedPages);

  bmarks = [];

  var bmarkPromise = new Promise(function (resolve, reject){
    chrome.bookmarks.getSubTree('1', function (bookmarkArray){
      bmarks = bookmarkArray[0].children;
      // console.log(bmarks);
      resolve();
    });
  });

  bmarkPromise.then(function (result){
    var bmarkUrls = [];
    for (var i = 0; i < bmarks.length; i++){
      bmarkUrls.push(bmarks[i].url);
    }

    for (var j = 0; j < sortedPages.length; j++){
      var sortedUrl = sortedPages[j][0];
      bbarIndex = bmarkUrls.indexOf(sortedUrl);

      /*
        if sorted page is not already on bbar
      */
      if (bbarIndex == -1){
        var bmInfo = {
          parentId: '1',
          index: j,
          title: pages[sortedUrl].title,
          url: sortedUrl
        };
        chrome.bookmarks.create(bmInfo);
      } else {
        var bmarkIndex = bmarkUrls.indexOf(sortedUrl);
        if (bmarks[bmarkIndex].title != pages[sortedUrl].title){
          chrome.bookmarks.update(bmarks[bmarkIndex].id, {title: pages[sortedUrl].title});
        }
        if (bbarIndex == j){
          continue;
        }
        chrome.bookmarks.move(bmarks[bmarkIndex].id, {index: j});
      }

    }
  });
}

function sortPages(){
  var sortable = [];
  for (var page in pages){
    sortable.push([page, pages[page].time]);
  }

  sortable.sort(function (a, b){
    return b[1] - a[1];
  });

  return sortable;
}

var pages = {};
chrome.storage.local.get('pages', function (items) {
  // console.log(items);
  if (items.pages){
    pages = items.pages;
    // console.log('Pages restored');
    console.log(pages);
  } else {
    // console.log('nothing in storage to restore');
  }
});
var currentPage = {};

function newTimer(page){
  pages[page.url] = {
    ts: new Date(),
    time: 0,
    title: page.title
  };
}

function updatePages(){
  var now = new Date();

  if (pages[currentPage.url]){
    pages[currentPage.url].time += now - pages[currentPage.url].ts;
    // console.log('time updated ' + currentPage.url + ' ' + pages[currentPage.url].time);
  } else {
    newTimer(currentPage);
    // console.log('timing new page 1 ' + currentPage.url);
  }

  chrome.storage.local.set({'pages': pages}, function () {
    // console.log('Pages saved');
  });
}

function restartTimer(tab){
  currentPage.url = tab.url;
  currentPage.title = tab.title;

  if (pages.hasOwnProperty(tab.url)){
    // console.log('restarting timer on ' + tab.url);
    pages[tab.url].ts = new Date();
    pages[tab.url].title = tab.title;
  } else {
    // console.log('timing new page 2 ' + tab.url);
    newTimer(currentPage);
  }
}

function intervalStart(){
  return setInterval(checkIn, 10000);
}

chrome.tabs.query({active: true, currentWindow: true}, function (tabArray){
  currentPage.url = tabArray[0].url;
  currentPage.title = tabArray[0].title;
  newTimer(currentPage);
});

chrome.tabs.onActivated.addListener(function (activeInfo){
  updatePages();

  chrome.tabs.get(activeInfo.tabId, function (tab){
    restartTimer(tab);
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
  // console.log(tab);
  if (changeInfo.status == 'complete' && tab.active){
    updatePages();
    restartTimer(tab);
  }
});

chrome.webNavigation.onTabReplaced.addListener(function (details){
  // console.log('tab replaced');
  // console.log(details);

  updatePages();
  chrome.tabs.get(details.tabId, function (tab){
    restartTimer(tab);
  });
});

prevWindowId = 0;
chrome.windows.onFocusChanged.addListener(function (windowId){
  // console.log(windowId);
  if (windowId == -1){
    // console.log('browser out of focus');
    if (prevWindowId != -1){
      updatePages();
    }
    clearInterval(checkInterval);
  } else {
    // console.log('browser back in focus');
    if (prevWindowId == -1){
      checkInterval = intervalStart();
    } else {
      updatePages();
    }
    chrome.tabs.query({active: true, currentWindow: true}, function (tabArray){
      restartTimer(tabArray[0]);
    });
  }
  prevWindowId = windowId;
});

chrome.idle.setDetectionInterval(30);
chrome.idle.onStateChanged.addListener(function (idleState){
  if (prevWindowId != -1){
    if (idleState == 'active'){
      // console.log('awake time');
      checkInterval = intervalStart();
      chrome.tabs.query({active: true, currentWindow: true}, function (tabArray){
        restartTimer(tabArray[0]);
      });
    } else {
      // console.log('sleepy time');
      updatePages();
      clearInterval(checkInterval);
    }
  }
});

var checkInterval = intervalStart();

// chrome.storage.local.clear(function() {
//   var error = chrome.runtime.lastError;
//   if (error) {
//     console.error(error);
//   } else {
//     console.log('storage cleared');
//   }
// });