var lastScrollTop = 0;
var lastScrollLeft = 0;
$(window).scroll(weirdScroll);

function weirdScroll(){
  $(window).off('scroll');
  // var st = $(this).scrollTop();
  var st = window.scrollY;
  var yPixels = randInt(1, 100);
  if (st > lastScrollTop){
    window.scrollBy(0, yPixels);
  } else {
    window.scrollBy(0, -yPixels);
  }
  lastScrollTop += yPixels;
  if (lastScrollTop > $(document).height() - $(window).height()){
    lastScrollTop = $(document).height() - $(window).height();
  }

  var sl = window.scrollX;
  var xPixels = randInt(1, 100);
  if (sl > lastScrollLeft){
    window.scrollBy(xPixels, 0);
  } else {
    window.scrollBy(-xPixels, 0);
  }
  lastScrollLeft += xPixels;
  if (lastScrollLeft > $(document).width() - $(window).width()){
    lastScrollLeft = $(document).width() - $(window).width();
  }
  setTimeout(function (){
    $(window).scroll(weirdScroll);
  }, 100);
}


function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}