var scrolling;
setScrolling(false);

function setScrolling(bool){
  scrolling = bool;
  chrome.runtime.sendMessage(bool);
}

$(function (){
  var scrollTimeout;
  var lastScrollTop = 0;
  $(window).scroll(function (e){
    var st = $(this).scrollTop();
    if (st > lastScrollTop){
      clearTimeout(scrollTimeout);

      if (!scrolling){
        setScrolling(true);
      }

      scrollTimeout = setTimeout(function (){
        setScrolling(false);
      }, 500);
    }
    lastScrollTop = st;
  });
});
