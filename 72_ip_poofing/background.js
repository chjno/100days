var packets = [];
var blankmark = 'http://itp.chino.kim/blankmark/icon.html';
var envmark = 'http://itp.chino.kim/blankmark/env.html';
var blankWin = window.open(blankmark, '');
var envWin = window.open(envmark, '');

var ready = false;
var iconCount = 0;

chrome.webRequest.onCompleted.addListener(
  function (details){
    packets.push(new Packet());
  },
  {urls: ["<all_urls>"]},
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
      chrome.bookmarks.move(this.bookmark.id, {parentId: '1', index: index}, function (){
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError.message);
        }
      });
      setTimeout(this.update.bind(this), 5);
    } else {
      chrome.bookmarks.remove(this.bookmark.id, function (){
        if (chrome.runtime.lastError) {
          chrome.bookmarks.getChildren('1', function (bookmarks){
            for (var b of bookmarks){
              if (b.url.indexOf('env.html') != -1){
                chrome.bookmarks.remove(b.id, function (){
                  if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                  }
                });
              }
            }
          });
        }
      });
      iconCount--;
      if (packets.length > 0){
        packets[0].create();
        packets.splice(0, 1);
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
  };

  this.create();
}

function clearBar(){
  chrome.bookmarks.getChildren('1', function (bookmarks){
    for (var b of bookmarks){
      chrome.bookmarks.remove(b.id);
    }
    blankWidth = 0;
  });
}

function adjustBlankWidth(winWidth){
  var iconWidth = 28;
  var blank = {
    parentId: '1',
    url: blankmark
  };

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
    if (msg.page == 'icon.html'){
      blankWin.close();
    } else if (msg.page == 'env.html'){
      envWin.close();
    }
  } else if (msg.type == 'width'){
    adjustBlankWidth(msg.width);
  }
});

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

clearBar();
updateBlanks();
