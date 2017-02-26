var popup = chrome.extension.getURL('popup/hand.html');
var win;

$(function (){
  $('body').click(function (e){
    e.preventDefault();
  });
});

$(window).click(function (e){
  console.log(e);
  var els = document.elementsFromPoint(e.pageX, e.pageY);
  for (var i = 0; i < els.length; i++){
    if (els[i].tagName == 'A'){
      win = window.open(popup, '', 'width=100, height=100, top=' + e.clientY + ', left=' + (e.clientX - 50));
      break;
    }
  }
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  win.close();
});