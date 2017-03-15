var widthTimeout;
$(window).resize(function (e) {
  clearTimeout(widthTimeout);
  widthTimeout = setTimeout(function (){
    chrome.runtime.sendMessage({type: 'width', width: window.outerWidth});
  }, 100);
});

window.onload = function () {
  if (window.location.href.indexOf('itp.chino.kim/blankmark') != -1){
    var pages = window.location.href.split('/');
    var page = pages[pages.length-1];
    chrome.runtime.sendMessage({type: 'blank', page: page});
  }
};