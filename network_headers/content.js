chrome.runtime.sendMessage({type: 'loading'});
var loaded = false;

var widthTimeout;
$(window).resize(function (e) {
  clearTimeout(widthTimeout);
  widthTimeout = setTimeout(function (){
    chrome.runtime.sendMessage({type: 'width', width: window.outerWidth});
  }, 100);
});

$(function (){
  if (window.location.href == 'http://itp.chino.kim/blankmark/icon.html'){
    chrome.runtime.sendMessage({type: 'blank'});
  } else if (window.location.href == 'http://itp.chino.kim/blankmark/env.html'){
    chrome.runtime.sendMessage({type: 'blank2'});
  }
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  if (msg.type == 'loaded'){
    if (loaded){
      sendResponse({type: 'loaded'});
    } else {
      sendResponse({type: 'loading'});
    }
  }
});

window.onload = function () {
  chrome.runtime.sendMessage({type: 'loaded'});
  loaded = true;
}