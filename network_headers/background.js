chrome.webRequest.onHeadersReceived.addListener(
  function (details){
    console.log(details);
  },
  {urls: ["<all_urls>"]},
  ["responseHeaders"]);
