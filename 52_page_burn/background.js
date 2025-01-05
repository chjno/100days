var scrollBarWidth = 0;
var prevImage;

//////////////////////////////////////////////////////////////////////
// tab switch
//////////////////////////////////////////////////////////////////////

chrome.tabs.onActivated.addListener(function (activeInfo) {

  chrome.tabs.query({}, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].id == activeInfo.tabId) {
        chrome.tabs.sendMessage(activeInfo.tabId, { type: 'status', active: true });
        chrome.tabs.sendMessage(activeInfo.tabId, { type: 'image', url: prevImage, scrollBarWidth: scrollBarWidth });
      } else {
        chrome.tabs.sendMessage(tabs[i].id, { type: 'status', active: false });
      }
    }
  });
});

//////////////////////////////////////////////////////////////////////
// on message
//////////////////////////////////////////////////////////////////////

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.type == 'init') {
    if (sender.tab.active) {
      chrome.tabs.sendMessage(sender.tab.id, { type: 'status', active: true });
    } else {
      chrome.tabs.sendMessage(sender.tab.id, { type: 'status', active: false });
    }

    if (prevImage) {
      chrome.tabs.sendMessage(sender.tab.id, { type: 'image', url: prevImage, scrollBarWidth: scrollBarWidth });
    }
  } else if (msg.type == 'burn') {
    scrollBarWidth = msg.scrollBarWidth || 0;
    screenshot();
  }
});

//////////////////////////////////////////////////////////////////////
// take screenshot
//////////////////////////////////////////////////////////////////////

function screenshot() {
  console.log('burning new image');
  chrome.tabs.captureVisibleTab(dataUrl => prevImage = dataUrl);
}
