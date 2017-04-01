chrome.tabs.onReplaced.addListener(function (tabId, replacedId){
  console.log('replaced');
  // chrome.tabs.executeScript(tabId, {file: 'content.js'});
});