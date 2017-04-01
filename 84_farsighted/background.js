var isFocused;

chrome.windows.getCurrent({}, function (win){
  isFocused = win.focused;
  toBlur(isFocused);
  init();
});


function init(){
  chrome.windows.onFocusChanged.addListener(function (windowId){
    if (windowId == -1){
      isFocused = false;
      toBlur(false);
    } else {
      isFocused = true;
      toBlur(true);
    }
  });

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
    if (msg == 'load'){
      toBlur(isFocused);
    }
  });
}

function toBlur(bool){
  chrome.tabs.query({}, function (tabs) {
    for (var i = 0; i < tabs.length; ++i) {
      chrome.tabs.sendMessage(tabs[i].id, bool);
    }
  });
}

/*
  only blur selected window, unblur background windows even if chrome is in focus  
*/