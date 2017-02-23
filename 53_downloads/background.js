var scrolling = false;
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  // console.log(msg);
  scrolling = msg;
  setDownloading(msg);
});

var downloadIds = [];
chrome.downloads.onCreated.addListener(function (downloadItem){
  // console.log(downloadItem);
  downloadIds.push(downloadItem.id);
  if (!scrolling){
    chrome.downloads.pause(downloadItem.id);
  }
});

chrome.downloads.onChanged.addListener(function (downloadDelta){
  // console.log(downloadDelta);
  if (downloadDelta.state){
    if (downloadDelta.state.current == 'complete'){
      var index = downloadIds.indexOf(downloadDelta.id);
      downloadIds.splice(index, 1);
    }
  }
});

function setDownloading(bool){
  if (bool){
    for (var i = 0; i < downloadIds.length; i++){
      chrome.downloads.resume(downloadIds[i]);
    }
  } else {
    for (var j = 0; j < downloadIds.length; j++){
      chrome.downloads.pause(downloadIds[j]);
    }
  }
}
