//////////////////////////////////////////////////////////////////////
// tab switch
//////////////////////////////////////////////////////////////////////

chrome.tabs.onActivated.addListener(function (activeInfo){

  chrome.tabs.query({}, function (tabs) {
    for (var i = 0; i < tabs.length; i++){
      if (tabs[i].id == activeInfo.tabId){
        chrome.tabs.sendMessage(activeInfo.tabId, {type: 'status', active: true});
      } else {
        chrome.tabs.sendMessage(tabs[i].id, {type: 'status', active: false});
      }
    }
  });
});

//////////////////////////////////////////////////////////////////////
// on message
//////////////////////////////////////////////////////////////////////

var burnLevel = 0;
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  if (msg == 'init'){
    if (sender.tab.active){
      chrome.tabs.sendMessage(sender.tab.id, {type: 'status', active: true});
    } else {
      chrome.tabs.sendMessage(sender.tab.id, {type: 'status', active: true});
    }
    if (prevImage){
      chrome.tabs.sendMessage(sender.tab.id, {type: 'image', url: prevImage});
    }
  } else if (msg == 'burn'){
    screenshot();
  }
});

//////////////////////////////////////////////////////////////////////
// take screenshot
//////////////////////////////////////////////////////////////////////

var prevImage;
function screenshot(){
  console.log('burning new image');
  chrome.tabs.captureVisibleTab(function (dataUrl) {
    // You can add that image HTML5 canvas, or Element.
    if (dataUrl != prevImage){
      prevImage = dataUrl;

      chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; i++){
          chrome.tabs.sendMessage(tabs[i].id, {type: 'image', url: dataUrl});
        }
      });
    }
  });
}
