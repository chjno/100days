

https://archive.org/wayback/available?url=google.com
https://archive.org/wayback/available?url=google.com&timestamp=2001


1996
new Date().getFullYear()



chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    insertDictionaryScript();
});

chrome.tabs.onCreated.addListener(function(tab) {         
   insertDictionaryScript();
});