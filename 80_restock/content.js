$(function (){
  $('img:visible').each(function (){
    this.style.visibility = 'hidden';
    var src = this.src;
    this.id = src;
    $(this).addClass('generify');
    chrome.runtime.sendMessage({type: 'original', src: src});
  });
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  var el = document.getElementById(msg.original);
  el.style.visibility = 'visible';
  el.src = msg.generic;
});