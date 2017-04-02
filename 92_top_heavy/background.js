var tabWeight = 100;

function weigh(){
  chrome.windows.getAll({populate: true}, function (winArr){
    for (var win of winArr){
      var tabCount = win.tabs.length;

      var maxTop = tabWeight * tabCount;

      if (win.top < maxTop){
        var params = {
          top: maxTop,
          height: bottom - maxTop
        };

        if (params.top > bottom - 40){
          params.top = bottom - 40;
        }

        if (params.top + win.height > bottom){
          params.height = bottom - params.top;
        }

        chrome.windows.update(win.id, params);
      }
    }
  });
}

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo){
  if (!removeInfo.isWindowClosing){
    chrome.windows.get(removeInfo.windowId, {}, function (win){
      var params = {
        top: win.top - tabWeight,
        height: win.height + tabWeight
      };

      chrome.windows.update(win.id, params);
    });
  }
});

var bottom = 0;
chrome.system.display.getInfo(function (ds){
  for (var display of ds){
    var b = display.bounds.top + display.bounds.height;
    if (b > bottom){
      bottom = b;
    }
  }
  setInterval(weigh, 200);
});