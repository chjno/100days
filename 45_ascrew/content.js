var winWidth = $(window).width();
var winHeight = $(window).height();
var winTop = $(window).scrollTop();
var winBot = winTop + $(window).height();
var winMidX = winWidth / 2;

var movers = [];
$(window).scroll(function (e){
  move();
});

function move(){
  winTop = $(window).scrollTop();
  winBot = winTop + $(window).height();

  $('body :visible').each(function (){
    if (this.id != 'chinos_div'){
      this.style.transform = "matrix(1, 0, 0, 1, 0, 0)";

      var thisTop = $(this).offset().top - winTop;
      var thisHeight = $(this).height();
      var thisBot = thisTop + thisHeight;
      var thisMidY = thisTop + (thisHeight / 2);
      var thisMidX = $(this).offset().left + ($(this).width() / 2);
      var fromWinMidX = winMidX - thisMidX;

      yRatio = thisMidY / winHeight;
      xTarget = winWidth * yRatio;
      xDelta = xTarget - thisMidX - fromWinMidX;

      if (thisHeight < $(window).height()){
        this.style = 'transform: translateX(' + xDelta + 'px); visibility: visible;';
      } else {
        this.style = 'visibility: hidden;';
      }
    }
  });
}

$(window).resize(function (e){
  winWidth = $(window).width();
  winHeight = $(window).height();
  winTop = $(window).scrollTop();
  winBot = winTop + $(window).height();
  winMidX = winWidth / 2;
});

$(function (){
  div = document.createElement('div');
  $(document.body).prepend(div);
  div.innerHTML = '.';
  div.style.visibility = 'hidden';
  div.style.marginBottom = $(window).height()/2 + 'px';
  div.id = 'chinos_div';
  // scrollTo(0, winHeight / 2);
  move();
});