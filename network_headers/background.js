// chrome.webRequest.onHeadersReceived.addListener(
//   function (details){
//     new Packet();
//   },
//   {urls: ["<all_urls>"]},
//   ["responseHeaders"]
// );

// var loaded = false;
var currentTabId = 0;
var packets = [];
var packeting = false;
chrome.webRequest.onCompleted.addListener(
  function (details){
    console.log(details);
    // if (loaded){
      packets.push(new Packet());
    // }
  },
  {urls: ["<all_urls>"]},
  // {urls: ["*://*.google.com/*"]},
  ["responseHeaders"]
);

function Packet(){
  this.setBookmark = function(b){
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message);
      chrome.bookmarks.getChildren('1', function (bookmarks){
        iconCount = bookmarks.length;
      });
      new Packet();
      return;
    }
    this.bookmark = b;
    this.update();
  };

  this.update = function(){
    var index = this.bookmark.index--;
    if (index >= 0){
      chrome.bookmarks.move(this.bookmark.id, {parentId: '1', index: index});
      setTimeout(this.update.bind(this), 5);
    } else {
      chrome.bookmarks.remove(this.bookmark.id);
      iconCount--;
      if (packets.length > 0){
        packets[0].create();
        packets.splice(0, 1);
      } else {
        packeting = false;
      }
    }
  };

  this.create = function(){
    var env = {
      parentId: '1',
      index: iconCount,
      url: envmark
    };
    iconCount++;
    chrome.bookmarks.create(env, this.setBookmark.bind(this));
  }

  if (!packeting){
    this.create();
    packeting = true;
  }
}

var blankmark = 'http://itp.chino.kim/blankmark/icon.html';
var envmark = 'http://itp.chino.kim/blankmark/env.html';
var win = window.open(blankmark, '');
var win2 = window.open(envmark, '');

var ready = false;
var iconCount = 0;

clearBar();
var iconWidth = 28;
var blank = {
  parentId: '1',
  url: blankmark
};

function clearBar(){
  chrome.bookmarks.getChildren('1', function (bookmarks){
    for (var b of bookmarks){
      chrome.bookmarks.remove(b.id);
    }
    blankWidth = 0;
  });
}

function adjustBlankWidth(winWidth){
  chrome.bookmarks.getChildren('1', function (bookmarks){
    iconCount = bookmarks.length;
    var blankWidth = bookmarks.length * iconWidth;
    var diff = winWidth - blankWidth;

    if (diff > 10000){
      diff = 10000;
    }

    if (diff > 0){
      var toAdd = Math.floor(diff/iconWidth);
      iconCount += toAdd;
      for (var i = 0; i < toAdd; i++){
        chrome.bookmarks.create(blank);
      }
    } else {
      var toRemove = Math.abs(Math.ceil(diff/iconWidth)) + 1;
      iconCount -= toRemove;
      for (var j = 0; j < toRemove; j++){
        var lastIndex = bookmarks.length - 1;
        while (bookmarks[lastIndex].url.indexOf('blankmark/env.html') >= 0 && lastIndex >= 0){
          lastIndex--;
        }
        chrome.bookmarks.remove(bookmarks[lastIndex].id);
        bookmarks.splice(lastIndex, 1);
      }
    }
    ready = true;
  });
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  if (msg.type == 'blank'){
    win.close();
  } else if (msg.type == 'blank2'){
    win2.close();
  }
  // else if (msg.type == 'loaded' && sender.tab.active){
  //   loaded = true;
  //   console.log(loaded);
  // } else if (msg.type == 'loading' && sender.tab.active){
  //   loaded = false;
  //   console.log(loaded);
  // }
});

// chrome.tabs.onActivated.addListener(function (activeInfo){
//   loaded = false;
//   currentTabId = activeInfo.tabId;
//   chrome.tabs.sendMessage(activeInfo.tabId, {type: 'loaded'});
// });

// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
//   console.log(changeInfo);
//   if (changeInfo.status == 'loading'){
//     loaded = false;
//   } else if (changeInfo.status == 'complete'){
//     loaded = true;
//   }
//   chrome.tabs.sendMessage(tab.id, {type: 'loaded'});
// });

// chrome.tabs.onReplaced.addListener(function (tabId, removedTabId){
//   currentTabId = tabId;
//   chrome.tabs.sendMessage(tabId, {type: 'loaded'});
// });

chrome.windows.onFocusChanged.addListener(function (windowId){
  updateBlanks();
});

function updateBlanks(){
  chrome.windows.getCurrent({}, function (window){
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message);
      return;
    }

    adjustBlankWidth(window.width);
  });
}

updateBlanks();
