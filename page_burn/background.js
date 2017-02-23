//////////////////////////////////////////////////////////////////////
// tab switch
//////////////////////////////////////////////////////////////////////

var currentTabId;
chrome.tabs.onActivated.addListener(function (activeInfo){
  currentTabId = activeInfo.tabId;
  console.log('current tab is ' + currentTabId)

  chrome.tabs.sendMessage(activeInfo.tabId, {type: 'status', active: true});
});

//////////////////////////////////////////////////////////////////////
// on message
//////////////////////////////////////////////////////////////////////

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  if (sender.tab.id != currentTabId){
    sendResponse({type: 'status', active: false});
  }
  else {
    console.log(sender.tab.id);
    console.log(msg);
  }
  if (msg >= 30){
    screenshot();
  }
});

//////////////////////////////////////////////////////////////////////
// take screenshot
//////////////////////////////////////////////////////////////////////

function screenshot(){
  chrome.tabs.captureVisibleTab(function (dataUrl) {
    // You can add that image HTML5 canvas, or Element.
    image = dataUrl;

    chrome.tabs.query({}, function (tabs) {
      for (var i = 0; i < tabs.length; i++){
        if (tabs[i].id != currentTabId){
          chrome.tabs.sendMessage(tabs[i].id, {type: 'image', url: dataUrl});
        }
      }
    });
  });
}
