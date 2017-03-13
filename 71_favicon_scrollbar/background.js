var blankmark = 'http://itp.chino.kim/blankmark/icon.html';
var win = window.open(blankmark, '');

var bMark;
var ready = false;
var iconCount = 0;

clearBar();
var iconWidth = 28;
var blank = {
  parentId: '1',
  url: blankmark
};
chrome.bookmarks.create(blank, function (b){
  bMark = b;
});

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
        while (bookmarks[lastIndex].id == bMark.id && lastIndex >= 0){
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
  if (msg.type == 'scroll'){
    moveBmark(msg.width);
  } else if (msg.type == 'width'){
    adjustBlankWidth(msg.width);
  } else if (msg.type == 'blank'){
    win.close();
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo){
  chrome.tabs.query({active: true, currentWindow: true}, function (tabArr){
    var tab = tabArr[0];
    chrome.tabs.sendMessage(tab.id, {type: 'width'});
    updateBmark(tab.url);
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
  if (changeInfo.status == 'complete'){
    updateBmark(tab.url);
  }
});

chrome.windows.onFocusChanged.addListener(function (windowId){
  updateBlanks();
  chrome.tabs.sendMessage(tab.id, {type: 'width'});
});

function updateBmark(url){
  chrome.bookmarks.update(bMark.id, {url: url});
}

function moveBmark(width){
  if (ready){
    var index = Math.floor(width / iconWidth);
    if (index > iconCount){
      index = iconCount;
    }  
    chrome.bookmarks.move(bMark.id, {parentId: '1', index: index});
  }
}

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