function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  console.log(msg);

  var imgs = $('img').filter(function (){
    var imgTop = $(this).offset().top;
    var imgBot = imgTop + $(this).height();
    var winTop = $(window).scrollTop();
    var winBot = winTop + $(window).height();
    if (imgTop > winTop && imgBot < winBot){
      return true;
    } else {
      return false;
    }
  });

  var randImg = imgs[randInt(0, imgs.length - 1)];
  randImg.src = msg;
});
