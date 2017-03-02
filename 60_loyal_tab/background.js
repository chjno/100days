// 80 px leftBuffer
// 60 px rightBuffer
// 230 tab width

chrome.runtime.onMessage.addListener(function (mouseX, sender, sendResponse) {
  chrome.windows.getCurrent({populate: true}, function (win){
    console.log(win);

    var tabCount = win.tabs.length;
    var tabWidth = (win.width - 140) / tabCount;
    var newIndex = Math.floor(mouseX / tabWidth);
    if (newIndex > tabCount - 1){
      newIndex = -1;
    }

    var currentTabId;
    for (var i = 0; i < tabCount; i++){
      if (win.tabs[i].active){
        currentTabId = win.tabs[i].id;
        break;
      }
    }

    chrome.tabs.move(currentTabId, {index: newIndex});
  });
});