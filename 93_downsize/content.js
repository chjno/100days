$(window).scroll(function (e){
  var top = $(window).scrollTop();
  var height = $(document).height();
  chrome.runtime.sendMessage({type: 'scroll', top: top, height: height});
});