var widthTimeout;
$(window).resize(function (e) {
  clearTimeout(widthTimeout);
  widthTimeout = setTimeout(function (){
    chrome.runtime.sendMessage({type: 'width', width: window.outerWidth});
  }, 100);
});

$(function (){
  sendScrollPosition();
  if (window.location.href == 'http://itp.chino.kim/blankmark/icon.html'){
    chrome.runtime.sendMessage({type: 'blank'});
  }
});

$(window).scroll(function (e){
  sendScrollPosition();
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  if (msg.type == 'width'){
    sendScrollPosition();
  }
});

function sendScrollPosition(){
  var max = $(document).height() - $(window).height();
  var ratio = $(window).scrollTop() / max;
  var width = window.outerWidth * ratio;

  chrome.runtime.sendMessage({type: 'scroll', width: width});
}