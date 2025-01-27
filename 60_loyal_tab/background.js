var leftBuffer = 90;
var tabWidth = 230;

chrome.runtime.onMessage.addListener(function (mouseX, sender, sendResponse) {
  chrome.windows.getCurrent({ populate: true }, function (win) {
    var tabCount = win.tabs.length;

    var newIndex;
    if (mouseX > leftBuffer) {
      newIndex = Math.floor((mouseX - leftBuffer) / tabWidth);
    } else {
      newIndex = 0;
    }
    if (newIndex > tabCount - 1) {
      newIndex = -1;
    }

    var currentTabId;
    for (var i = 0; i < tabCount; i++) {
      if (win.tabs[i].active) {
        currentTabId = win.tabs[i].id;
        break;
      }
    }

    chrome.tabs.move(currentTabId, { index: newIndex });
  });
});