var page = chrome.extension.getURL('ps.html');
var tp = window.open(page, "ps", "width=300, height=322");
// tp.onblur = function(){
//   console.log('on blur');
//   tp.focus();
// };
// FIXME always on top
// http://stackoverflow.com/questions/26101435/how-to-make-popup-window-always-on-top

var currentTabId = 0;
chrome.tabs.onActivated.addListener(function (activeInfo){
  console.log('active tab ' + activeInfo.tabId);
  currentTabId = activeInfo.tabId;
});


chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  // console.log(msg);

  chrome.tabs.sendMessage(currentTabId, msg);

  // switch (msg.type){
  //   case 'click':
  //     console.log(msg.button);
  //     if (msg.button == 'l'){
  //       chrome.tabs.sendMessage(currentTabId, msg);
  //     } else {
  //       chrome.tabs.sendMessage(currentTabId, msg);
  //     }
  //     break;
  //   case 'mouse':
  //     console.log(msg.dx, msg.dy);
  //     chrome.tabs.sendMessage(currentTabId, msg);
  //     break;
  //   case 'scroll':
  //     console.log(msg.dx, msg.dy);
  //     chrome.tabs.sendMessage(currentTabId, msg);
  //     break;
  // }
});



chrome.tabs.onActivated.addListener(function (activeInfo){
  console.log(activeInfo.tabId);

  // chrome.tabs.get(activeInfo.tabId, function (tab){
  //   restartTimer(tab);
  // });
});




// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
//   // console.log(tab);
//   if (changeInfo.status == 'complete' && tab.active){
//     updatePages();
//     restartTimer(tab);
//   }
// });

chrome.webNavigation.onTabReplaced.addListener(function (details){
  console.log('tab replaced');
  console.log(details.tabId);

  // updatePages();
  // chrome.tabs.get(details.tabId, function (tab){
  //   restartTimer(tab);
  // });
});