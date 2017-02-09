$(function (){
  chrome.runtime.sendMessage(true);
  
  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
    // console.log(msg);
    if (msg){
      browse();
    } else {
      clearTimeout(timeout);
    }
  });

  function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var timeout;
  function browse(){
    var winHeight = $(window).height();
    smoothScroll.animateScroll(randInt(0, winHeight));
    timeout = setTimeout(browse, randInt(500, 3000));
  }
});
