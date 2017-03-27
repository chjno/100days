$(function (){
  chrome.runtime.sendMessage('load');

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
    if (msg){
      document.body.style.filter = 'blur(5px)';
    } else {
      document.body.style.filter = '';
    }
  });
});