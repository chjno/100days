var widthTimeout;
window.onresize = function(e) {
  clearTimeout(widthTimeout);
  widthTimeout = setTimeout(function (){
    chrome.runtime.sendMessage({type: 'width', width: window.outerWidth});
  }, 100);
};

window.onload = function () {
  if (window.location.href == 'http://itp.chino.kim/blankmark/icon.html'){
    chrome.runtime.sendMessage({type: 'blank'});
  }
};