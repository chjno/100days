var winBuffer = 150;

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  chrome.windows.get(sender.tab.windowId, {populate: true}, function (win){
    var tabCount = win.tabs.length;
    var spaceForTabs = win.width - winBuffer;
    var tabWidth = spaceForTabs / tabCount;
    if (tabWidth > 230){
      tabWidth = 230;
    }

    var tabLeft = sender.tab.index * tabWidth + 80;

    chrome.tabs.sendMessage(sender.tab.id, {tabWidth: tabWidth, tabLeft: tabLeft});
  });
});

chrome.tabs.onReplaced.addListener(function (tabId, removedId){
  console.log('tab replaced');
});

chrome.tabs.onDetached.addListener(function (tabId, detachInfo){
  reIndex(detachInfo.oldWindowId);
  chrome.tabs.get(tabId, function (tab){
    reIndex(tab.windowId);
  });
});


chrome.tabs.onAttached.addListener(function (tabId, attachInfo){
  reIndex(attachInfo.windowId);
});

chrome.tabs.onCreated.addListener(function (tab){
  reIndex(tab.windowId);
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo){
  if (!removeInfo.isWindowClosing){
    reIndex(removeInfo.windowId);
  }
})


chrome.tabs.onMoved.addListener(function (tabId, moveInfo){
  reIndex(moveInfo.windowId);
});


function reIndex(windowId){
  chrome.windows.get(windowId, {populate: true}, function (win){
    var tabCount = win.tabs.length;
    var spaceForTabs = win.width - winBuffer;
    var tabWidth = spaceForTabs / tabCount;
    if (tabWidth > 230){
      tabWidth = 230;
    }

    for (var tab of win.tabs){
      var tabLeft = tab.index * tabWidth + 80;
      chrome.tabs.sendMessage(tab.id, {tabWidth: tabWidth, tabLeft: tabLeft});
    }
  });
}