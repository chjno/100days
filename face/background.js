var faceHtml = chrome.extension.getURL('face/index.html');
chrome.windows.create({url: faceHtml}, function (win){
  faceId = win.id;
});

var display = [];
chrome.system.display.getInfo(function (ds){
  ds[0].bounds.right = ds[0].bounds.left + ds[0].bounds.width;
  ds[0].bounds.bottom = ds[0].bounds.top + ds[0].bounds.height;
  display = ds[0].bounds;
});

var faceId;
var minimized = false;
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  if (msg.face){
    // x: 0-440
    // y: 0-280
    // width/height: 100-305
    
    // var ratio = {
    //   x: 1 - msg.info.x / 440,
    //   y: msg.info.y / 280,
    //   wh: 1 - (msg.info.width - 100) / 205
    // };
    var ratio = 1 - (msg.info.width - 100) / 205;
    

    chrome.windows.getCurrent({populate: true}, function (win){
      for (var tab of win.tabs){
        if (tab.active){
          if (tab.url.indexOf('chrome') != 0){
            chrome.tabs.setZoom(tab.id, ratio);
          }
        }
      }
    });
    if (!minimized){
      var params = {
        left: display.right - 1,
        top: display.bottom - 1,
        focused: false
      };
      chrome.windows.update(faceId, params);
      minimized = true;
    }
  }
});