var displays = [];
chrome.system.display.getInfo(function (ds){
  for (var display of ds){
    displays.push(display.bounds);
  }
});

chrome.windows.onFocusChanged.addListener(function (windowId){
  if (windowId == -1){
    chrome.windows.getLastFocused({}, function (win){
      for (var display of displays){
        if (win.left >= display.left && win.left <= display.left + display.width &&
          win.top >= display.top && win.top <= display.top + display.height){
            var params = {
              left: display.left,
              top: display.top,
              width: display.width,
              height: display.height,
              focused: true
            };
            chrome.windows.update(win.id, params);
            break;
        }
      }
    });
  }
});