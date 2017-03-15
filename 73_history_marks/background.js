var tabUrls = {
  // tabId: url
};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
  if (!tabUrls.hasOwnProperty(tabId)){
    tabUrls[tabId] = '';
  }
  if (changeInfo.status == 'complete' && tab.url != tabUrls[tabId]){
    tabUrls[tabId] = tab.url;
    book(tab.url);
  }
});

function book(url){
  chrome.bookmarks.getRecent(1, function (bookmarks){
    if (bookmarks.length === 0 || bookmarks[0].url != url){
      var bookmark = {
        parentId: '1',
        index: 0,
        title: '',
        url: url
      };
      chrome.bookmarks.create(bookmark);
    }
  });
}

function clearBar(){
  chrome.bookmarks.getChildren('1', function (bookmarks){
    for (var b of bookmarks){
      chrome.bookmarks.remove(b.id);
    }
  });
}

clearBar();